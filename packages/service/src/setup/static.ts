/**
 * Static assets config.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import express from "express";

import { ACTION } from "~common/app/api";
import { useMemory } from "~service/logic/memory";
import { apiV1 } from "~service/setup/env";




/**
 * Static assets sharing configuration.
 */
export default function configureStatic (): void {

    // app objects
    const { app, firstWorker, knownVars: { staticDir }, logger } = useMemory();

    if (firstWorker) logger.write("[static] ... ");

    // share static directory, no indexing, no dot-files
    app.use(`${apiV1}${ACTION.static}`, express.static(staticDir, {
        dotfiles: "ignore",
        index: false,
    }));

    if (firstWorker) logger.ok("OK");
}
