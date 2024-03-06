/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import { HttpMessage } from "~common/framework/http";
import type { ComplexRecord } from "~common/lib/struct";
import { substitute } from "~common/framework/routing";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";
import { apiV1 } from "~service/setup/env";
import { ACTION } from "~common/app/api";




/**
 * ...
 */
const layers = [
    {
        "id": "base",
        "type": "raster",
        "source": "baseraster",
    },
];




/**
 * Get map style. Raster.
 */
export const mapRasterStyle: RequestHandler<
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

        // all available raster tile source names
        const tileSourceNames = model.mbtile.getSourceNames().filter((n) => {
            const format = model.mbtile.getMeta(n, "format") ?? "unknown";
            return (
                format === "jpg" || format === "jpeg" ||
                format === "png" || format === "webp"
            );
        });

        // check if given raster source is available
        if (!tileSourceNames.includes(name)) {
            errorStatus = 404;
            throw new Error(HttpMessage.C404);
        }

        // guess self origin
        // (read from vars - production/behind reverse proxy,
        // or guess from headers)
        const selfOrigin =
            isString(vars.serviceOriginUrl)
                ? vars.serviceOriginUrl
                : `${req.protocol}://${req.headers.host}${apiV1}`;

        // tile sources (dynamic)
        const sources = {
            baseraster: {
                type: "raster",
                url: [
                    selfOrigin,
                    substitute(ACTION.tileJson, { name }),
                ].join(""),
                scheme: "xyz",
                tileSize: 256,
            },
        };

        // map style - root
        const style = {
            version: 8,
            name,
            sources,
            layers,
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
            .send(style);

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
