/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { createTimedBarrier } from "@xcmats/js-toolbox/async";
import { isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import type { ComplexRecord } from "~common/lib/struct";
import { httpGetHandleRedirect } from "~common/lib/http";
import { HttpMessage } from "~common/framework/http";




/**
 * CORS proxy. Only for JSON responses.
 */
export const networkProxy: RequestHandler<
    ParamsDictionary,
    ComplexRecord | ResponseErr,
    { url: unknown }
> = async (req, res, next) => {

    const { url } = req.body;

    let errorStatus = 404;

    try {

        // check post body value types
        if (!isString(url)) {
            errorStatus = 400;
            throw new Error(HttpMessage.C400);
        }

        // establish proxied connection
        const conn = await httpGetHandleRedirect(url);

        // check response type
        if (
            !isString(conn.response.headers["content-type"]) ||
            !conn.response.headers["content-type"].includes("application/json")
        ) {
            errorStatus = 404;
            throw new Error(HttpMessage.C404);
        }

        // barrier
        const barrier = createTimedBarrier<void>();

        // send headers
        res.header({ ...conn.response.headers });

        // stream response
        conn.response.pipe(res);

        // all ok
        conn.response.on("end", () => {
            conn.request.end();
            res.status(200);
            barrier.resolve();
        });

        await barrier.lock();

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
