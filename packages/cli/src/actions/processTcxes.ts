/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { basename, join } from "node:path";
import { map } from "@xcmats/js-toolbox/async";
import { isString, undefinedToNull } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { exportDataStructure } from "~common/app/models/garmin";
import { useMemory } from "~cli/setup/memory";
import { info, infonl, oknl, progress, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import {
    extractBeginTimestamp,
    extractTrack,
    getTcxFilenames,
    parseTcxFile,
} from "~common/tcx/lib";

import simpleTrackCheckQuery from "~common/app/queries/simpleTrack.check.sql";
import simpleTrackDdlQuery from "~common/app/queries/simpleTrack.ddl.sql";
import simpleTrackInsertQuery from "~common/app/queries/simpleTrack.insert.sql";




/**
 * Process tcx-file activities.
 */
export const processTcxes: CliAction<{
    userShortId?: string;
}> = async ({ userShortId }) => {

    const { db, pgp, sql, vars } = useMemory();

    // extract process configuration variables
    const { extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(extractsDir)) {
            throw new Error("Missing or malformed [extractsDir] variable.");
        }

        // check arguments validity
        if (!isString(userShortId)) {
            throw new Error("Provide [userShortId].");
        }

        // extract directory
        const extractDir = join(extractsDir, userShortId);

        // fit-file directory (inside extract directory)
        const tracksDir = join(extractDir, exportDataStructure.tracksDir);

        // tcx-file activity filenames
        const tcxFilenames =
            (await getTcxFilenames(tracksDir))
                .map((f) => join(tracksDir, f));

        // ensure the presence of simple track data table
        await db.none(sql(simpleTrackDdlQuery));

        // process tcx files file-by-file
        info("number of tcx files: "); shoutnl(tcxFilenames.length);
        await map(tcxFilenames) (async (tcxFilename, i) => {

            // progress-bar
            progress(i + 1, tcxFilenames.length);

            try {

                // filename without directory
                const sourceName = basename(tcxFilename);

                // check if processed file already exists in db
                // (parsing big files is time-consuming, so we can avoid it)
                const { track_found: trackFound } =
                    await db.one<{ track_found: boolean }>(
                        sql(simpleTrackCheckQuery),
                        { source_name: sourceName },
                    );

                // skip already processed fit-files
                if (trackFound) return;

                // tcx-file contents (parsed)
                const tcx = await parseTcxFile(tcxFilename);

                // find "start event" timestamp
                const beginTimestamp = extractBeginTimestamp(tcx);

                // skip tcx-files without "start" event
                if (!beginTimestamp) return;

                // extract track from tcx object (only array of lon-lat pairs)
                const track = extractTrack(tcx);

                // skip empty tracks
                if (track.length === 0) return;

                await db.one(sql(simpleTrackInsertQuery), {
                    user_short_id: userShortId,
                    source_type: "tcx",
                    source_name: sourceName,
                    activity_timestamp: undefinedToNull(tcx.timestamp),
                    sport: tcx.sport,
                    begin_timestamp: beginTimestamp,
                    line: [
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
