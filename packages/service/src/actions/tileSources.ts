/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { ResponseErr } from "~common/framework/actions";
import type { TileSourcesResponseOk } from "~common/app/actions/tile";
import { useMemory } from "~service/logic/memory";




/**
 * List all available tile sources (names and formats).
 */
export const tileSources: RequestHandler<
    ParamsDictionary,
    TileSourcesResponseOk | ResponseErr
> = async (_req, res, next) => {

    const { model } = useMemory();

    const errorStatus = 500;

    try {

        // all ok
        res.status(200).send({
            sources: model.mbtile.getSourceNames().map((name) => ({
                name,
                format: model.mbtile.getMeta(name, "format") ?? "unknown",
            })),
        });

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
