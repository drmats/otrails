/**
 * Type helpers.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import http from "node:http";
import express from "express";




/**
 * Explicit http server type helper.
 */
export type HttpServer = ReturnType<typeof http.createServer>;




/**
 * Explicit express server type helper.
 */
export type AppServer = ReturnType<typeof express>;
