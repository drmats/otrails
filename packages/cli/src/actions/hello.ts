/**
 * Otrails - trails, ours.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */


import { useMemory } from "~cli/index";
import { gitAuthorDate, gitVersion } from "~common/lib/dev";
import { infonl, note, oknl, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/errors";
import { name as appName, version as appVersion } from "~cli/../package.json";

import gisVersionQuery from "~cli/queries/gisVersion.sql";
import pgVersionQuery from "~cli/queries/pgVersion.sql";




/**
 * "Hello world".
 */
export const hello = async (): Promise<void> => {

    const { db, pgp, sql, vars } = useMemory();

    try {

        infonl();

        note("name: "); shoutnl(`${appName}-${appVersion}`);
        note("build: "); shoutnl(`${gitVersion()}-${gitAuthorDate()}`);
        note("database in use: "); shoutnl(`${vars.dbHost}/${vars.dbName}`);

        infonl();

        note("executing: "); infonl(pgVersionQuery);
        const pgVersion = await db.one<{ version: string }>(sql(pgVersionQuery));
        oknl(pgVersion.version);

        note("executing: "); infonl(gisVersionQuery);
        const gisVersion = await db.one<{ version: string }>(sql(gisVersionQuery));
        oknl(gisVersion.version);

        infonl();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
