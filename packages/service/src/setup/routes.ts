/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { ACTION } from "~common/app/api";
import { useMemory } from "~service/logic/memory";
import { apiV1 } from "~service/setup/env";
import { hello } from "~service/actions/hello";
import { tileGet } from "~service/actions/tileGet";
import { tileJson } from "~service/actions/tileJson";
import { tileSources } from "~service/actions/tileSources";




/**
 * Routes configuration.
 */
export default function configureRoutes (): void {

    // app objects
    const { app, firstWorker, logger } = useMemory();

    if (firstWorker) logger.write("[routes] ... ");

    // express app
    app

        // "hello world" route
        .get(
            `${apiV1}${ACTION.hello}`,
            hello,
        )

        // one tile - pbf format
        .get(
            `${apiV1}${ACTION.tileGetPbf}`,
            tileGet,
        )

        // one tile - webp format
        .get(
            `${apiV1}${ACTION.tileGetWebp}`,
            tileGet,
        )

        // one tile - png format
        .get(
            `${apiV1}${ACTION.tileGetPng}`,
            tileGet,
        )

        // tile source schema
        .get(
            `${apiV1}${ACTION.tileJson}`,
            tileJson,
        )

        // list of tile sources
        .get(
            `${apiV1}${ACTION.tileSources}`,
            tileSources,
        );

    if (firstWorker) {
        logger.writeContinue(`(${Object.keys(ACTION).length}) ... `);
        logger.ok("OK");
    }

}
