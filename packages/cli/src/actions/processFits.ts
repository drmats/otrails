/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { map } from "@xcmats/js-toolbox/async";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { exportDataStructure } from "~common/app/models/garmin";
import { useMemory } from "~cli/setup/main";
import { infonl, oknl, progress } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import {
    containData,
    extractBeginTimestamp,
    extractTrack,
    getFitFilenames,
    parseFitFile,
} from "~common/fit/lib";

import fitTrackDdlQuery from "~cli/queries/fitTrack.ddl.sql";
import fitTrackInsertQuery from "~cli/queries/fitTrack.insert.sql";




/**
 * Process fit-file activities.
 */
export const processFits: CliAction<{
    userShortId?: string;
}> = async ({ userShortId }) => {

    const { db, pgp, sql, vars } = useMemory();

    // extract process configuration variables
    const { extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(extractsDir)) {
            throw new Error("Missing or malformed extract variable.");
        }

        // check arguments validity
        if (!isString(userShortId)) {
            throw new Error("Provide [userShortId].");
        }

        // extract directory
        const extractDir = join(extractsDir, userShortId);

        // fit-file directory (inside extract directory)
        const tracksDir = join(extractDir, exportDataStructure.tracksDir);

        // fit-file activity filenames
        const fitFilenames =
            (await getFitFilenames(tracksDir))
                .map((f) => join(tracksDir, f));

        // ensure presence of fit track data table
        await db.none(sql(fitTrackDdlQuery));

        // process summaries file-by-file
        await map(fitFilenames) (async (fitFilename, i) => {

            // progress-bar
            progress(i + 1, fitFilenames.length + 1);

            try {

                // fit-file contents (parsed)
                const fit = await parseFitFile(fitFilename);
                const activity = fit.activity;

                // skip "empty" (no track data) fit-files
                if (!containData(activity)) return;

                // find "start event" timestamp
                const beginTimestamp = extractBeginTimestamp(activity);

                // skip fit-files without "start" event
                if (!beginTimestamp) return;

                // extract track from activity (only array of lon-lat pairs)
                const track = extractTrack(activity);

                // insert track as a linestring
                await db.one(sql(fitTrackInsertQuery), {
                    user_short_id: userShortId,
                    begin_timestamp: beginTimestamp,
                    track: [
                        "LINESTRING(",
                        track.map(([lon, lat]) => `${lon} ${lat}`).join(", "),
                        ")",
                    ].join(""),
                });

            } catch {
                return;
            }

        });

        infonl(); oknl("DONE");

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
