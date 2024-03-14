/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import {
    countdown,
    createAutoSpinner,
    err,
    info,
    infonl,
    notenl,
    oknl,
    shoutnl,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";

import wipeAllDataQuery from "~common/app/queries/wipeAllData.sql";




/**
 * Wipe all data from postgis (all schemas - cascade).
 */
export const wipeAllData: CliAction = async () => {

    const { db, sql, vars } = useMemory();

    try {

        // database info
        infonl();
        info("database in use: "); shoutnl(`${vars.dbHost}/${vars.dbName}`);

        // double-check
        infonl();
        err("This operation is irreversible. ");
        shoutnl("Are you sure?");
        notenl("Hit ctrl+C to abort.");
        await countdown();

        // erase
        infonl();
        info("Deleting all data... "); const spinner = createAutoSpinner();
        await db.none(sql(wipeAllDataQuery));
        spinner.dispose(); infonl();

        oknl("DONE");
        infonl();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
