/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. syntaxval. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { info, infonl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";

/**
 * "aggy".
 */
export const aggy: CliAction = async () => {
    try {
        infonl();
        info("this is aggy!");
        infonl();
    } catch (e) {
        printError(e);
        process.exit(1);
    }
};
