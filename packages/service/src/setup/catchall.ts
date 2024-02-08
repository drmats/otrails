/**
 * Catch all (*) configuration.
 *
 * @module @xcmats/express-catchall
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import type { Express, Router as ExpressRouter } from "express";
import { share } from "mem-box";
import { dict } from "@xcmats/js-toolbox/struct";
import { isArray } from "@xcmats/js-toolbox/type";

import { useMemory } from "~service/logic/memory";
import { HttpMessage } from "~common/framework/http";




/**
 * Type definitions for some express.js internals.
 */
interface Route {
    path: string;
    methods: Record<string, string>;
}
interface Layer {
    route: Route;
}
interface Router extends ExpressRouter {
    stack: Layer[];
}
interface ExpressApp extends Express {
    _router: Router;
}
interface ExtendedCtx extends Ctx {
    app: ExpressApp;
}




/**
 * Catch all route configuration.
 */
export default function configureCatchall (): void {

    const

        // explicit cast to an extended type
        { app, knownVars: { servicePort } } = useMemory() as ExtendedCtx,

        // routes (pathnames with trailing slashes) and their allowed methods
        routes = dict(
            app._router.stack
                // find layer with routes
                .filter(l => l.route)
                // extract paths and methods from routes
                .map<[string, string[]]>(l => [
                    l.route.path.endsWith("/") ?
                        l.route.path : `${l.route.path}/`,
                    Object.keys(l.route.methods)
                        .map(m => m.toUpperCase()),
                ])
                // append "HEAD" method to all routes with "GET" method
                .map<[string, string[]]>(([p, m]) =>
                    [p, m.concat(m.find(v => v === "GET") ? ["HEAD"] : [])],
                )
                // sort by path
                .sort(([a, _1], [b, _2]) => a.localeCompare(b)),
        );


    // share catchall-specific variables
    share({ routes });


    // catch-all (404)
    app.use("*", (req, res, next) => {
        if (!res.headersSent) {
            let originalPath = (new URL(
                req.originalUrl,
                `http://localhost:${servicePort}/`,
            )).pathname;
            if (!originalPath) {
                res.status(500).end();
                return next(new Error(HttpMessage.C500));
            }
            if (!originalPath.endsWith("/")) originalPath += "/";
            if (req.method !== "OPTIONS") {
                if (
                    routes[originalPath] &&
                    !routes[originalPath]?.includes(req.method)
                ) {
                    res.status(405).send({ error: HttpMessage.C405 });
                } else {
                    res.status(404).send({ error: HttpMessage.C404 });
                }
            } else {
                if (isArray(routes[originalPath])) {
                    res.header({ "Allow": routes[originalPath]!.join(",") });
                    res.status(204).end();
                } else {
                    res.header({ "Allow": "GET" });
                    res.status(204).end();
                }
            }
        }
        return next();
    });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        readonly routes: Record<string, string[]>;
    }
}
