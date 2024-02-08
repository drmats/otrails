/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/ban-types */

import pg, {
    type IDatabase,
    type IMain,
} from "pg-promise";
import { share } from "mem-box";
import { isString } from "@xcmats/js-toolbox/type";

import { useMemory } from "~cli/setup/memory";
import { buildPgConnectionString, sqlMemo } from "~common/lib/pgsql";
import { errnl } from "~common/lib/terminal";




/**
 * PostgreSQL database configuration.
 */
export default function configureDatabase (): void {

    // app objects
    const { vars } = useMemory();

    // database configuration variables
    const { dbUser, dbPass, dbHost, dbName } = vars;

    // check variables validity
    if (
        !isString(dbUser) || !isString(dbPass) ||
        !isString(dbHost) || !isString(dbName)
    ) {
        errnl("Missing or malformed database configuration variables.");
        process.exit(1);
    }

    const

        // pg-promise instance
        pgp = pg(),

        // postgresql database connection
        db = pgp(buildPgConnectionString({
            user: dbUser,
            pass: dbPass,
            host: dbHost,
            name: dbName,
        })),

        // QueryFiles linking helper with memoization
        sql = sqlMemo();

    // share application-specific variables
    share({ pgp, db, sql });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        pgp: IMain<{}>;
        db: IDatabase<{}>;
        sql: ReturnType<typeof sqlMemo>;
    }
}
