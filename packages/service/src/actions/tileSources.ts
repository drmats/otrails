/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import type { ResponseErr } from "~common/framework/actions";
import type { TileSourceNamesResponseOk } from "~common/app/actions/tile";
import { useMemory } from "~service/logic/memory";




/**
 * List all available tile source names.
 */
export const tileSources: RequestHandler<
    ParamsDictionary,
    TileSourceNamesResponseOk | ResponseErr
> = async (_req, res, next) => {

    const { model } = useMemory();

    const errorStatus = 500;

    try {

        // all ok
        res.status(200).send({
            names: model.mbtile.getSourceNames(),
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
