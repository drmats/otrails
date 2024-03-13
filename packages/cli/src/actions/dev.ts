/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import repl from "node:repl";
import BetterSqlite3 from "better-sqlite3";
import * as box from "@xcmats/js-toolbox";
import * as turf from "@turf/turf";

import type { CliAction } from "~common/framework/actions";
import type { FreeFormRecord } from "~common/lib/type";
import { printError } from "~common/lib/error";
import { useMemory } from "~cli/setup/memory";

import * as appModelsGarmin from "~common/app/models/garmin";
import * as appModelsSetting from "~common/app/models/setting";
import * as libAsync from "~common/lib/async";
import * as libDayjs from "~common/lib/dayjs";
import * as libDev from "~common/lib/dev";
import * as libError from "~common/lib/error";
import * as libFit from "~common/fit/lib";
import * as libFs from "~common/lib/fs";
import * as libHttp from "~common/lib/http";
import * as libIds from "~common/lib/ids";
import * as libIgc from "~common/igc/lib";
import * as libMbtilesLib from "~common/mbtiles/lib";
import * as libMbtilesMath from "~common/mbtiles/math";
import * as libPgsql from "~common/lib/pgsql";
import * as libSqlite from "~common/sqlite/lib";
import * as libString from "~common/lib/string";
import * as libStruct from "~common/lib/struct";
import * as libTcx from "~common/tcx/lib";
import * as libTerminal from "~common/lib/terminal";
import * as libTime from "~common/lib/time";
import * as libType from "~common/lib/type";
import * as libUuid from "~common/lib/uuid";
import * as libZip from "~common/lib/zip";




/**
 * Start interactive shell with augmented context.
 */
export const startDevCli = async <A extends FreeFormRecord<unknown>>(
    a?: A,
): Promise<void> => {
    const mutex = box.createMutex<void>();
    const ctx = useMemory();
    const augment = typeof a !== "undefined" ? a : {};
    const replServer = repl.start({ prompt: "otrails-cli> " });

    replServer.on("exit", mutex.resolve);
    Object.assign(replServer.context, {
        $: augment,
        app: {
            models: {
                garmin: appModelsGarmin,
                setting: appModelsSetting,
            },
        },
        box,
        ctx,
        lib: {
            async: libAsync, dayjs: libDayjs, dev: libDev, error: libError,
            fit: libFit, fs: libFs, http: libHttp, ids: libIds, igc: libIgc,
            mbtiles: { lib: libMbtilesLib, math: libMbtilesMath },
            pgsql: libPgsql, sqlite: libSqlite, string: libString,
            struct: libStruct, tcx: libTcx, terminal: libTerminal,
            time: libTime, type: libType, uuid: libUuid, zip: libZip,
        },
        Sqlite: BetterSqlite3,
        turf,
        vars: ctx.vars,
    });

    return mutex.lock();
};




/**
 * Dev repl.
 */
export const devConsole: CliAction<{ cwd: string }> = async ({ cwd }) => {

    try {

        // change current working directory
        process.chdir(cwd);

        // interactive shell
        await startDevCli();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
