/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import BetterSqlite3 from "better-sqlite3";
import { share } from "mem-box";

import { useMemory } from "~service/logic/memory";
import { setPragmas } from "~common/sqlite/lib";
import { ensureDirectory } from "~common/lib/fs";




/**
 * SQLite3 database configuration.
 */
export default async function configureDatabase (): Promise<void> {

    // app objects
    const {
        firstWorker, logger,
        knownVars: { serviceDb, serviceDbDir },
    } = useMemory();

    // logging
    if (firstWorker) logger.write("[db] ... ");

    // ensure database directory presence
    try {
        await ensureDirectory(serviceDbDir);
    } catch (e) {
        let message = String(e);
        if (e instanceof Error) message = e.message;
        logger.error("FATAL:", message);
        process.exit(1);
    }

    // sqlite3 database instance
    const db = new BetterSqlite3(serviceDb);

    // pragmas
    const pragmas = setPragmas(db);

    // logging
    if (firstWorker) logger.writeContinue(`(${serviceDb}) ... `);
    if (firstWorker) logger.ok("OK");

    // shared memory
    share({ db, pragmas });

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        readonly db: BetterSqlite3.Database;
        readonly pragmas: string[];
    }
}
