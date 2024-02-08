/**
 * Redirects configuration.
 *
 * @module @xcmats/express-redirects
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { useMemory } from "~service/logic/memory";
import { apiRoot, apiV1, rootPath } from "~service/setup/env";




/**
 * Redirects configuration.
 */
export default function configureRedirects (): void {

    const { app } = useMemory();

    // in case `rootPath` is not a `/` (no-proxy redirect)
    if (rootPath !== "/") {
        app.get("/", (_req, res, next) => {
            res.redirect(`${apiV1}/`);
            return next();
        });
    }

    // redirect: rootPath -> apiV1
    app.get(rootPath, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

    // redirect: apiRoot -> apiV1
    app.get(`${apiRoot}/`, (_req, res, next) => {
        res.redirect(`${apiV1}/`);
        return next();
    });

}
