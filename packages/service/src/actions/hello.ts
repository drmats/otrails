/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";

import { gitAuthorDate, gitVersion } from "~common/lib/dev";
import { name as appName, version } from "~service/../package.json";




/**
 * "Hello world".
 */
export const hello: RequestHandler = async (_req, res, next) => {

    const errorStatus = 500;

    try {

        // all ok
        res.status(200).send({
            name: `${appName}-${version}`,
            build: `${gitVersion()}-${gitAuthorDate()}`,
            visit: "https://wchmurach.com.pl/",
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
