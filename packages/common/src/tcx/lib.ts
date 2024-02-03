/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readFile } from "node:fs/promises";
import { parseStringPromise } from "xml2js";
import { isArray, isNumber, isString } from "@xcmats/js-toolbox/type";

import { fsWalk } from "~common/lib/fs";
import { isComplexRecord, type ComplexRecord, isPlainRecord } from "~common/lib/struct";
import { isValidDate } from "~common/lib/time";




/**
 * Get all tcx filenames from given directory.
 */
export const getTcxFilenames = async (path: string): Promise<string[]> => {
    const fitFilenames: string[] = [];
    await fsWalk(path, async (_, name) => {
        if (name.endsWith(".tcx")) fitFilenames.push(name);
    }, { maxDepth: 0 });
    return fitFilenames;
};




/**
 * Parsed tcx-file shape.
 */
export type TcxObject = {
    activity: ComplexRecord;
    timestamp?: Date;
    sport: string;
    xml: ComplexRecord;
};




/**
 * Parse a single tcx file.
 */
export const parseTcxFile = async (path: string): Promise<TcxObject> => {
    const source = await readFile(path, { encoding: "utf8" });
    const xml = await parseStringPromise(source, {
        async: true,
        trim: true,
        normalize: true,
        emptyTag: () => ({}),
    }) as ComplexRecord;

    if (
        !isComplexRecord(xml.TrainingCenterDatabase) ||
        !isArray(xml.TrainingCenterDatabase.Activities) ||
        !isComplexRecord(xml.TrainingCenterDatabase.Activities[0]) ||
        !isArray(xml.TrainingCenterDatabase.Activities[0].Activity) ||
        !isComplexRecord(xml.TrainingCenterDatabase.Activities[0].Activity[0])
    ) {
        throw new Error("bad tcx file structure");
    }
    const activity = xml.TrainingCenterDatabase.Activities[0].Activity[0];

    let timestamp: Date | undefined = undefined;
    if (isArray(activity.Id) && isString(activity.Id[0])) {
        const tsCandidate = new Date(activity.Id[0]);
        if (isValidDate(tsCandidate)) timestamp = tsCandidate;
    }

    let sport = "other";
    if (isPlainRecord(activity.$) && isString(activity.$.Sport)) {
        sport = activity.$.Sport.toLowerCase();
    }

    return {
        activity, timestamp, sport, xml,
    };
};




/**
 * Extract very first timestamp of tcx object.
 */
export const extractBeginTimestamp = (
    tcx: TcxObject,
): Date | undefined => {
    let timestamp: Date | undefined = undefined;

    if (
        isArray(tcx.activity.Lap) &&
        isComplexRecord(tcx.activity.Lap[0]) &&
        isPlainRecord(tcx.activity.Lap[0].$) &&
        isString(tcx.activity.Lap[0].$.StartTime)
    ) {
        const tsCandidate = new Date(tcx.activity.Lap[0].$.StartTime);
        if (isValidDate(tsCandidate)) timestamp = tsCandidate;
    }

    return timestamp;
};




/**
 * Extract array of [lon, lat] positions from tcx object.
 */
export const extractTrack = (tcx: TcxObject): [number, number][] => {
    const extractedTrack: [number, number][] = [];

    const trackpointToLonLat = (
        trackpoint: unknown,
    ): [number, number] | undefined => {
        if (
            isComplexRecord(trackpoint) &&
            isArray(trackpoint.Position) &&
            isComplexRecord(trackpoint.Position[0]) &&
            isArray(trackpoint.Position[0].LongitudeDegrees) &&
            isString(trackpoint.Position[0].LongitudeDegrees[0]) &&
            isArray(trackpoint.Position[0].LatitudeDegrees) &&
            isString(trackpoint.Position[0].LatitudeDegrees[0])
        ) {
            const
                lon = Number(trackpoint.Position[0].LongitudeDegrees[0]),
                lat = Number(trackpoint.Position[0].LatitudeDegrees[0]);
            if (isNumber(lon) && isNumber(lat)) return [lon, lat];
        }
        return undefined;
    };

    if (isArray(tcx.activity.Lap)) {
        for (const lap of tcx.activity.Lap) {
            if (isComplexRecord(lap) && isArray(lap.Track)) {
                for (const track of lap.Track) {
                    if (isComplexRecord(track) && isArray(track.Trackpoint)) {
                        for (const trackpoint of track.Trackpoint) {
                            const lonlat = trackpointToLonLat(trackpoint);
                            if (lonlat) extractedTrack.push(lonlat);
                        }
                    }
                }
            }
        }
    }

    return extractedTrack;
};
