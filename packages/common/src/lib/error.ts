/**
 * Error handling.
 *
 * @module @xcmats/error
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { range } from "@xcmats/js-toolbox/array";

import { err, infonl, shoutnl } from "~common/lib/terminal";




/**
 * Try error pretty-printing (terminal).
 */
export const printError = (ex: unknown, indent = 0): void => {
    const spaces = range(indent).map(() => "    ").join("");

    if (indent === 0) err("ERROR ");

    if (ex instanceof AggregateError) {
        if (indent === 0) shoutnl();
        ex.errors.forEach((e) => printError(e, indent + 1));
    } else if (ex instanceof Error) {
        shoutnl(`${spaces}${ex.message}`);
    } else {
        shoutnl(`${spaces}${String(ex)}`);
    }

    if (indent === 0) infonl();
};
