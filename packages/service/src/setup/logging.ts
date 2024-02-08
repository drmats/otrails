/**
 * Logging configuration.
 *
 * @module @xcmats/logging
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

/* eslint-disable no-console */

import type { Fun } from "@xcmats/js-toolbox/type";
import chalk from "chalk";
import { share } from "mem-box";

import { useMemory } from "~service/logic/memory";
import { isoNow } from "~common/lib/time";
import { write as terminalWrite } from "~common/lib/terminal";




/**
 * Extended console.
 */
export interface ExtendedConsole extends Console {
    ok: Fun;
    err: Fun;
    note: Fun;
    write: Fun;
    writeContinue: Fun;
    writeEnd: typeof console.log;
}




/**
 * Logging builder (stub).
 */
export const buildLogger = (): ExtendedConsole => ({
    ...console,
    ok: (...text: unknown[]) =>
        console.info(...text.map(txt => chalk.greenBright(txt))),
    err: (...text: unknown[]) =>
        console.error(...text.map(txt => chalk.red(txt))),
    error: (...text: unknown[]) =>
        console.error(...[
            chalk.gray(isoNow()),
            chalk.red("!"),
            ...text,
        ]),
    note: (...text: unknown[]) =>
        console.info(...text.map(txt => chalk.gray(txt))),
    warn: (...text: unknown[]) =>
        console.warn(...text.map(txt => chalk.yellow(txt))),
    info: (...text: unknown[]) =>
        console.info(...[
            chalk.gray(isoNow()), ...text,
        ]),
    write: (...text: unknown[]) =>
        terminalWrite([
            chalk.gray(isoNow()),
            ...(text.map(String)),
        ].join(" ")),
    writeContinue: (...text: unknown[]) =>
        terminalWrite(text.map(String).join(" ")),
    writeEnd: console.log,
});




/**
 * Logging configuration.
 */
export default function configureLogging (): void {

    // app objects
    const { firstWorker } = useMemory();

    // console logger
    const logger = buildLogger();

    // ...
    if (firstWorker) logger.info("initializing ...");

    // share logger-specific variables
    share({ logger });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        readonly logger: ExtendedConsole;
    }
}
