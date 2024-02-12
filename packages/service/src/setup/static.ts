/**
 * Static assets config.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import express from "express";

import { useMemory } from "~service/logic/memory";




/**
 * Static assets sharing configuration.
 */
export default function configureStatic (): void {

    // app objects
    const { app, knownVars: { staticDir } } = useMemory();

    // share static directory, no indexing, no dot-files
    app.use("/static", express.static(staticDir, {
        dotfiles: "ignore",
        index: false,
    }));

}
