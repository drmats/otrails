/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { basename, join } from "node:path";
import { map } from "@xcmats/js-toolbox/async";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { info, infonl, oknl, progress, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import {
    extract2DTrack,
    extractBeginTimestamp,
    getIgcFilenames,
    parseIgcFile,
} from "~common/igc/lib";

import simpleTrackCheckQuery from "~common/app/queries/simpleTrack.check.sql";
import simpleTrackDdlQuery from "~common/app/queries/simpleTrack.ddl.sql";
import simpleTrackInsertQuery from "~common/app/queries/simpleTrack.insert.sql";




/**
 * Process igc flights.
 */
export const processIgcs: CliAction<{
    folder?: string;
    userShortId?: string;
    tandem?: boolean;
}> = async ({ folder, userShortId, tandem }) => {

    const { db, sql, vars } = useMemory();

    // extract process configuration variables
    const { flightsDir } = vars;

    try {

        // check variables validity
        if (!isString(flightsDir)) {
            throw new Error("Missing or malformed [flightsDir] variable.");
        }

        // check arguments validity
        if (!isString(folder) || !isString(userShortId)) {
            throw new Error("Provide [folder] and [userShortId].");
        }

        // igc directory
        const tracksDir = join(flightsDir, folder);

        // igc-file activity filenames
        const igcFilenames =
            (await getIgcFilenames(tracksDir))
                .map((f) => join(tracksDir, f));

        // ensure the presence of simple track data table
        await db.none(sql(simpleTrackDdlQuery));

        // process igc files file-by-file
        info("number of igc files: "); shoutnl(igcFilenames.length);
        await map(igcFilenames) (async (igcFilename, i) => {

            // progress-bar
            progress(i + 1, igcFilenames.length);

            try {

                // filename without directory
                const sourceName = basename(igcFilename);

                // check if processed file already exists in db
                // (parsing big files is time-consuming, so we can avoid it)
                const { track_found: trackFound } =
                    await db.one<{ track_found: boolean }>(
                        sql(simpleTrackCheckQuery),
                        { source_name: sourceName },
                    );

                // skip already processed igc-files
                if (trackFound) return;

                // igc-file contents (parsed)
                const igc = await parseIgcFile(igcFilename);

                // find "start event" timestamp
                const beginTimestamp = extractBeginTimestamp(igc);

                // skip igc-files without "start" event
                if (!beginTimestamp) return;

                // extract track from activity (only array of lon-lat pairs)
                const track = extract2DTrack(igc);

                // skip empty tracks
                if (track.length === 0) return;

                // insert track as a linestring
                await db.one(sql(simpleTrackInsertQuery), {
                    user_short_id: userShortId,
                    source_type: "igc",
                    source_name: sourceName,
                    activity_timestamp: null,
                    sport: !tandem ? "paragliding" : "tandem_paragliding",
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

    return;

};
