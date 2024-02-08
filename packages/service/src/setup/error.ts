/**
 * Error handling configuration.
 *
 * @module @xcmats/express-logging
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { Request, Response, NextFunction } from "express";
import chalk from "chalk";

import { useMemory } from "~service/logic/memory";




/**
 * Error handling configuration.
 */
export default function configureErrorHandling (): void {

    // shared application objects
    const { app, logger } = useMemory();


    // simple request logger
    app.use((req, res, next) => {

        // don't log successful cors preflight checks
        if (req.method !== "OPTIONS" || res.statusCode !== 204) {

            logger.info(
                req.ip ?? "aborted", chalk.gray(req.method), req.url,
                (
                    res.statusCode < 400 ? chalk.green : chalk.red
                )(res.statusCode),
                `pid:[${chalk.green(process.pid)}]`,
            );

        }

        // oops...
        if (!res.headersSent) { next(new Error("panic!")); }

    });


    // simple error handler/logger
    app.use((
        error: Error, req: Request, res: Response, _next: NextFunction,
    ) => {

        if (res.headersSent) {

            logger.info(
                chalk.red(req.ip ?? "aborted"),
                chalk.gray(req.method), req.url,
                chalk.red(res.statusCode),
                `pid:[${chalk.green(process.pid)}]`,
            );

        } else {

            res.status(500).send({ error: error.toString() });

            logger.info(
                chalk.red(req.ip ?? "aborted"),
                chalk.gray(req.method), req.url,
                chalk.red(500), chalk.red("!"),
                `pid:[${chalk.green(process.pid)}]`,
            );

            logger.err(error.toString());

        }

    });

}
