/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import chalk from "chalk";

import { useMemory } from "~service/logic/memory";




/**
 * Process termination configuration.
 */
export default function configureTermination (): void {

    const { db, logger, server } = useMemory();

    const serverShutdown = (code: number) => {
        if (db.open) db.close();
        if (server.listening) {
            server.close((err) => {
                if (!err) {
                    logger.info(
                        `[${
                            chalk.yellowBright("app")
                        }]:${
                            chalk.green(process.pid)
                        }`,
                    );
                } else {
                    logger.info(
                        `[${
                            chalk.redBright("ERROR")
                        }]:${
                            chalk.green(process.pid)
                        }:(${err.message})`,
                    );
                }
                process.exit(code);
            });
        } else {
            process.exit(code);
        }
    };

    process.on("SIGHUP", () => {
        logger.info(
            `[${chalk.yellow("SIGHUP")}]:${chalk.green(process.pid)}`,
        );
        serverShutdown(128 + 1);
    });

    process.on("SIGINT", () => {
        logger.info(
            `[${chalk.yellow("SIGINT")}]:${chalk.green(process.pid)}`,
        );
        serverShutdown(128 + 2);
    });

    process.on("SIGTERM", () => {
        logger.info(
            `[${chalk.yellow("SIGTERM")}]:${chalk.green(process.pid)}`,
        );
        serverShutdown(128 + 15);
    });

}
