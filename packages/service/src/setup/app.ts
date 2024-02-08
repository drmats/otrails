/**
 * Express app config.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { json, urlencoded } from "express";

import { useMemory } from "~service/logic/memory";




/**
 * Express app configuration.
 */
export default function configureApp (): void {

    // app objects
    const { app } = useMemory();

    // trust proxy, use json and url encoding
    app.enable("trust proxy");
    app.enable("strict routing");
    app.use(json({ limit: "64kb" }));
    app.use(urlencoded({ extended: true }));
}
