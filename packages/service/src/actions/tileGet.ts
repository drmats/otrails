/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import { HttpMessage } from "~common/framework/http";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";




/**
 * Get one tile by source name and z-x-y coordinates.
 */
export const tileGet: RequestHandler<
    ParamsDictionary,
    Buffer | ResponseErr
> = async (req, res, next) => {

    const { model } = useMemory();

    const
        { name, z: inZ, x: inX, y: inY } = req.params,
        z = Number(inZ),
        x = Number(inX),
        y = Number(inY);

    let errorStatus = 404;

    try {

        // check param value types
        if (
            !isString(name) ||
            !isNumber(z) || !isNumber(x) || !isNumber(y)
        ) {
            errorStatus = 400;
            throw new Error(HttpMessage.C400);
        }

        // try fetching tile from appropriate tilesource
        const data = model.mbtile.get(name, { z, x, y });

        // try guessing if data is gzipped
        const isCompressed =
            data.length >= 2 &&
            data[0] === 0x1f && data[1] === 0x8b;

        // all ok
        res
            .header({
                "content-type": "application/x-protobuf",
                "cache-control": `public, max-age=${TILE_VALIDITY_PERIOD}`,
                "expires": (
                    new Date(Date.now() + TILE_VALIDITY_PERIOD)
                ).toUTCString(),
                ...(
                    isCompressed
                        ? { "content-encoding": "gzip" }
                        : {}
                ),
            })
            .status(200)
            .send(data);

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
