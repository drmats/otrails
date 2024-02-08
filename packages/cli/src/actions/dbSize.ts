/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { info, infonl, oknl, shout, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";

import dbSizeQuery from "~common/app/queries/dbSize.sql";




/**
 * Check database size.
 */
export const dbSize: CliAction<{
    name: string;
}> = async ({ name }) => {

    const { db, pgp, sql, vars } = useMemory();

    try {

        // database check
        infonl();
        info("database in use: "); shoutnl(`${vars.dbHost}/${vars.dbName}`);

        // database size check
        infonl();
        info("name: "); shout(name); info(" ");
        const { size } = await db.one<{ size: string }>(
            sql(dbSizeQuery),
            { databaseName: name },
        );
        info("size: "); oknl(size);

        infonl();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
