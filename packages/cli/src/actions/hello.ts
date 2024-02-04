/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/main";
import { gitAuthorDate, gitVersion } from "~common/lib/dev";
import { indent } from "~common/lib/string";
import { info, infonl, oknl, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { name as appName, version as appVersion } from "~cli/../package.json";

import gisVersionQuery from "~common/app/queries/gisVersion.sql";
import pgVersionQuery from "~common/app/queries/pgVersion.sql";




/**
 * ...
 */
const kvMatch = (input: string, k: string): string | undefined => {
    const r = new RegExp(`${k}="([^"]+)"`);
    try { return input.match(r)![1]; }
    catch { return undefined; }
};




/**
 * "Hello world".
 */
export const hello: CliAction = async () => {

    const { db, pgp, sql, vars } = useMemory();

    try {

        // database check
        infonl();
        info("database in use: "); shoutnl(`${vars.dbHost}/${vars.dbName}`);

        // application name, version and build
        infonl();
        info("app name: "); shoutnl(`${appName}-${appVersion}`);
        info("app build: "); shoutnl(`${gitVersion()}-${gitAuthorDate()}`);

        // postgresql version
        infonl();
        info("executing: "); shoutnl(pgVersionQuery);
        const { version: pgVersion } = await db.one<{ version: string }>(
            sql(pgVersionQuery),
        );
        oknl(indent(pgVersion.split(", ").join("\n")));

        // postgis and its dependencies versions
        infonl();
        info("executing: "); shoutnl(gisVersionQuery);
        const { version: gisVersion } = await db.one<{ version: string }>(
            sql(gisVersionQuery),
        );
        [
            "POSTGIS", "PGSQL", "GEOS",
            "LIBXML", "LIBJSON", "LIBPROTOBUF", "WAGYU",
        ].forEach((key) => {
            oknl(indent(`${key}: "${kvMatch(gisVersion, key) ?? ""}"`));
        });

        infonl();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
