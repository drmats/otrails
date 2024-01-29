/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import repl from "node:repl";
import * as box from "@xcmats/js-toolbox";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/main";
import { printError } from "~common/lib/error";
import * as async from "~common/lib/async";
import * as dev from "~common/lib/dev";
import * as error from "~common/lib/error";
import * as fs from "~common/lib/fs";
import * as ids from "~common/lib/ids";
import * as pgsql from "~common/lib/pgsql";
import * as string from "~common/lib/string";
import * as struct from "~common/lib/struct";
import * as terminal from "~common/lib/terminal";
import * as type from "~common/lib/type";
import * as uuid from "~common/lib/uuid";
import * as zip from "~common/lib/zip";




/**
 * Dev repl.
 */
export const devConsole: CliAction<{ cwd: string }> = async ({ cwd }) => {

    const ctx = useMemory();
    const { pgp } = ctx;

    try {

        // change current working directory
        process.chdir(cwd);

        // start interactive shell with augmented context
        Object.assign(repl.start({}).context, {
            ctx,
            lib: {
                async, dev, error, fs, ids, pgsql, string,
                struct, terminal, type, uuid, zip,
            },
            box,
        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
