/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readFile } from "node:fs/promises";
import FitParser, { type FitActivity, type FitObject } from "fit-file-parser";
import { isNumber } from "@xcmats/js-toolbox/type";

import { fsWalk } from "~common/lib/fs";
import { isValidDate } from "~common/lib/time";




/**
 * Get all fit filenames from given directory.
 */
export const getFitFilenames = async (path: string): Promise<string[]> => {
    const fitFilenames: string[] = [];
    await fsWalk(path, async (_, name) => {
        if (name.endsWith(".fit")) fitFilenames.push(name);
    }, { maxDepth: 0 });
    return fitFilenames;
};




/**
 * Parse a single fit file.
 */
export const parseFitFile = async (path: string): Promise<FitObject> => {
    const fitParser = new FitParser({
        force: true,
        speedUnit: "km/h",
        lengthUnit: "m",
        temperatureUnit: "celsius",
        elapsedRecordField: true,
        mode: "cascade",
    });
    const fit = await readFile(path);

    return await new Promise((res, rej) => {
        fitParser.parse(fit, (err, data) => {
            if (err) rej(new Error(err));
            else res(data);
        });
    });
};




/**
 * Check if given fit activity (potentially) contain track data.
 */
export const containData = (
    activity?: FitActivity,
): activity is FitActivity =>
    typeof activity !== "undefined" &&
    isValidDate(activity.timestamp) &&
    activity.sessions.length > 0 &&
    activity.events.length > 0;




/**
 * Extract very first timestamp of activity.
 */
export const extractBeginTimestamp = (
    activity: FitActivity,
): Date | undefined =>
    activity.events
        .filter((e) => e.event === "timer" && e.event_type === "start")
        .map((e) => e.timestamp)[0];




/**
 * Extract array of [lon, lat] positions from activity.
 */
export const extractTrack = (activity: FitActivity): [number, number][] => {
    const track: [number, number][] = [];

    for (const session of activity.sessions) {
        if (session.laps) {
            for (const lap of session.laps) {
                if (lap.records) {
                    for (const r of lap.records) {
                        if (
                            isNumber(r.position_long) &&
                            isNumber(r.position_lat)
                        ) {
                            track.push([r.position_long, r.position_lat]);
                        }
                    }
                }
            }
        }
    }

    return track;
};
