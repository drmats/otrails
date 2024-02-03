/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { map, promisePool } from "@xcmats/js-toolbox/async";
import { isArray, isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import {
    exportDataStructure,
    isSummarizedActivity,
    summarizedActivityToSqlParams,
} from "~common/app/models/garmin";
import { useMemory } from "~cli/setup/main";
import {
    createAutoSpinner,
    info,
    infonl,
    oknl,
    progress,
    shoutnl,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import type { ComplexValue } from "~common/lib/type";
import { readJSON } from "~common/lib/fs";
import { isComplexRecord } from "~common/lib/struct";

import summarizedActivityDdlQuery from "~cli/queries/summarizedActivity.ddl.sql";
import summarizedActivityInsertQuery from "~cli/queries/summarizedActivity.insert.sql";




// success type
type SummaryOk = { insertOk: true };

// failure type
type SummaryErr = { error: unknown };

// promise pool size (request parallelization)
const DEFAULT_POOL_SIZE = 32;




/**
 * Process summarized activities.
 */
export const processSummaries: CliAction<{
    userShortId?: string;
}> = async ({ userShortId }) => {

    const { db, pgp, sql, vars } = useMemory();

    // extract process configuration variables
    const { extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(extractsDir)) {
            throw new Error("Missing or malformed [extract] variable.");
        }

        // check arguments validity
        if (!isString(userShortId)) {
            throw new Error("Provide [userShortId].");
        }

        // extract directory
        const extractDir = join(extractsDir, userShortId);

        // fitness directory (inside extract directory)
        const fitnessDir = join(extractDir, exportDataStructure.fitnessDir);

        // summarized activity filenames
        const summaryFilenames =
            (await readdir(fitnessDir))
                .filter((f) => exportDataStructure.summaryFilePattern.test(f))
                .map((f) => join(fitnessDir, f));

        // ensure presence of summarized activity data table
        await db.none(sql(summarizedActivityDdlQuery));

        // process summaries file-by-file
        await map(summaryFilenames) (async (summaryFilename) => {

            info("processing: "); shoutnl(summaryFilename);

            // summary file contents (parsed)
            const summarizedActivitiesFile =
                await readJSON<ComplexValue[]>(summaryFilename);
            if (
                !isArray(summarizedActivitiesFile) ||
                summarizedActivitiesFile.length !== 1 ||
                !isComplexRecord(summarizedActivitiesFile[0]) ||
                !isArray(summarizedActivitiesFile[0].summarizedActivitiesExport)
            ) {
                throw new Error(`wrong structure: ${summaryFilename}`);
            }

            // array of summarized activities
            // (`summarizedActivitiesFile` contains array with one element
            // being an object with `summarizedActivitiesExport` key)
            const summarizedActivities =
                summarizedActivitiesFile[0].summarizedActivitiesExport;

            // execution pool
            const pool = promisePool<SummaryOk, SummaryErr>(DEFAULT_POOL_SIZE);

            // process entries
            info("number of entries: "); shoutnl(summarizedActivities.length);
            await map(summarizedActivities) (async (summarizedActivity, i) => {

                // progress-bar
                progress(i + 1, summarizedActivities.length + 1);

                // data-check (do nothing on malformed data entry)
                if (!isSummarizedActivity(summarizedActivity)) {
                    return;
                }

                // schedule summarized activity insertion to database
                await pool.exec(async () => {
                    // insert summarized activity into database
                    await db.one(
                        sql(summarizedActivityInsertQuery),
                        summarizedActivityToSqlParams(
                            userShortId, summarizedActivity,
                        ),
                    );
                    return { insertOk: true };
                });

            });

            // await for all entries still "in flight"
            info(" "); const spinner = createAutoSpinner();
            await pool.finish();

            // one `summarizedActivities` processed ok
            spinner.dispose(); infonl(); oknl("DONE");

        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
