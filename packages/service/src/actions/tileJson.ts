/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { handleException } from "@xcmats/js-toolbox/func";
import { isArray, isNumber, isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import { HttpMessage } from "~common/framework/http";
import { isComplexRecord, type ComplexRecord } from "~common/lib/struct";
import { substitute } from "~common/framework/routing";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";
import { apiV1 } from "~service/setup/env";
import { ACTION } from "~common/app/api";




/**
 * Get tile schema (tilejson) by source name.
 *
 * @see https://github.com/mapbox/tilejson-spec/blob/master/3.0.0/schema.json
 */
export const tileJson: RequestHandler<
    ParamsDictionary,
    ComplexRecord | ResponseErr
> = async (req, res, next) => {

    const { model, vars } = useMemory();

    const { name } = req.params;

    let errorStatus = 404;

    try {

        // check param value types
        if (!isString(name)) {
            errorStatus = 400;
            throw new Error(HttpMessage.C400);
        }

        // try fetching tile from appropriate tilesource
        const meta = model.mbtile.getAllMeta(name);

        // guess self origin
        // (read from vars - production/behind reverse proxy,
        // or guess from headers)
        const selfOrigin =
            isString(vars.serviceOriginUrl)
                ? vars.serviceOriginUrl
                : `${req.protocol}://${req.headers.host}${apiV1}`;

        // tile bounds
        const bounds = handleException(() => {
            if (!isString(meta.bounds)) throw new Error("empty");
            return JSON.parse(`[${meta.bounds}]`) as number[];
        }, () => [ -180, -85, 180, 85 ]);

        // map center
        const center = handleException(() => {
            if (!isString(meta.center)) throw new Error("empty");
            return JSON.parse(`[${meta.center}]`) as number[];
        }, () => undefined);

        // map version
        const version = (() => {
            if (isNumber(meta.version)) {
                if (meta.version - Math.floor(meta.version) === 0)
                    return `${meta.version}.0.0`;
                else
                    return `${meta.version}.0`;
            }
            return "1.0.0";
        })();

        // where to find actual tiles?
        const tileGetPathSchema = substitute(
            meta.format === "pbf"
                ? ACTION.tileGetPbf
                : meta.format === "webp"
                    ? ACTION.tileGetWebp
                    : ACTION.tileGetPng,
            { name, x: "{x}", y: "{y}", z: "{z}" },
        );

        // tilejson
        const schema = {
            tilejson: "3.0.0",
            name: meta.name,
            description: meta.description,
            attribution: meta.attribution,
            type: meta.type,
            scheme: "xyz",
            format: meta.format,
            bounds,
            center,
            version,
            minzoom: meta.minzoom,
            maxzoom: meta.maxzoom,
            vector_layers:
                isComplexRecord(meta.json) && isArray(meta.json.vector_layers)
                    ? meta.json.vector_layers : [],
            tiles: [`${selfOrigin}${tileGetPathSchema}`],
            generator: meta.generator,
        };

        // all ok
        res
            .header({
                "cache-control": `public, max-age=${TILE_VALIDITY_PERIOD}`,
                "expires": (
                    new Date(Date.now() + TILE_VALIDITY_PERIOD)
                ).toUTCString(),
            })
            .status(200)
            .send(schema);

    } catch (e) {

        if (e instanceof Error) {
            res.status(errorStatus).send({ error: e.message });
        } else {
            res.status(500).send({ error: String(e) });
            return next(e);
        }

    }

    return next();

};
