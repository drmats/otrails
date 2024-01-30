/**
 * Terminal helpers.
 *
 * @module @xcmats/terminal
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

/* eslint-disable no-console */

import chalk from "chalk";
import { range } from "@xcmats/js-toolbox/array";
import { delay } from "@xcmats/js-toolbox/async";
import { flow } from "@xcmats/js-toolbox/func";
import { log10 } from "@xcmats/js-toolbox/math";
import { padLeft } from "@xcmats/js-toolbox/string";
import { timeUnit } from "@xcmats/js-toolbox/utils";




/**
 * Unbuffered write.
 */
export const write = process.stdout.write.bind(process.stdout);




/**
 * Stdout/stderr helpers.
 */
export const err = flow(chalk.redBright, process.stderr.write.bind(process.stderr));
export const errnl = flow(chalk.redBright, console.error.bind(console));
export const info = process.stdout.write.bind(process.stdout);
export const infonl = console.info.bind(console);
export const note = flow(chalk.gray, info);
export const notenl = flow(chalk.gray, infonl);
export const ok = flow(chalk.greenBright, info);
export const oknl = flow(chalk.greenBright, infonl);
export const shout = flow(chalk.whiteBright, info);
export const shoutnl = flow(chalk.whiteBright, infonl);
export const warn = flow(chalk.yellow, info);
export const warnnl = flow(chalk.yellow, infonl);




/**
 * ANSI term-control escapes.
 */
export const overwrite = (output: string): boolean => write("\x1B[0G" + output);
export const clearline = (): boolean => write("\x1B[2K");
export const moveToStart = (): boolean => write("\x1B[0G");
export const moveBack = (n = 1): boolean => write(`\x1B[${n}D`);




/**
 * Visual countdown timer.
 */
export const countdown = async (time = 5 * timeUnit.second): Promise<void> => {
    const ticks = 50, quant = time / ticks;

    for (let i = 0; i < ticks; i++) {
        const
            step = Math.ceil((ticks-i) * 10 / ticks),
            color = step > 3 ? chalk.green : chalk.red;
        overwrite([
            color(padLeft(String(step), 2, "0")),
            " [",
            color(range(ticks-i).map(() => "=").join("")),
            range(i).map(() => " ").join(""),
            "]",
        ].join(""));
        await delay(quant);
    }

    clearline();
    moveToStart();
};




/**
 * Visual progress bar.
 */
export const progress = (
    current: number,
    max: number,
    suffix?: string,
): void => {
    const
        ticks = 40,
        c = current / max * ticks,
        percentage = Math.round(current/(max)*100);

    overwrite([
        chalk.whiteBright(
            padLeft(String(current), Math.ceil(log10(max)), "0"),
        ), " [",
        chalk.greenBright(range(Math.ceil(c)).map(() => "=").join("")),
        current !== max ?
            range(ticks - Math.floor(c) - 1).map(() => " ").join("") : "",
        "] ",
        chalk.whiteBright(`${padLeft(percentage+"", 3)}%`),
        suffix ? ` ${suffix}` : "",
    ].join(""));
};




/**
 * Visual spinner.
 */
export const createSpinner = (): {
    tick: () => void;
    dispose: () => void;
} => {
    const states = ["-", "\\", "|", "/"];
    let currentState = 0;

    write(`[${chalk.yellowBright(states[currentState++])}]`);

    return ({
        tick: () => {
            moveBack(2);
            write(`${chalk.yellowBright(states[currentState++])}]`);
            if (currentState === states.length) currentState = 0;
        },
        dispose: () => {
            moveBack(3);
            write("   ");
            moveBack(3);
        },
    });
};




/**
 * Auto-incrementing spinner.
 */
export const createAutoSpinner = (): {
    dispose: () => void;
} => {
    const spinner = createSpinner();
    const handle = setInterval(spinner.tick, 100);
    return {
        dispose: () => {
            clearInterval(handle);
            spinner.dispose();
        },
    };
};
