/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readFile } from "node:fs/promises";
import { parse, type IGCFile } from "igc-parser";

import { getExtFilenames } from "~common/lib/fs";
import { isValidDate } from "~common/lib/time";




/**
 * Get all igc filenames from given directory.
 */
export const getIgcFilenames = async (
    path: string,
): Promise<string[]> => getExtFilenames(path, ".igc");




/**
 * Parse a single igc file.
 */
export const parseIgcFile = async (path: string): Promise<IGCFile> => {
    const source = await readFile(path, { encoding: "utf8" });
    return parse(source, { lenient: true });
};




/**
 * Extract very first timestamp of igc file object.
 */
export const extractBeginTimestamp = (igc: IGCFile): Date | undefined => {
    let timestamp: Date | undefined = undefined;
    const validFixes = igc.fixes.filter((fix) => fix.valid);

    if (validFixes.length > 0) {
        const tsCandidate = new Date(validFixes[0].timestamp);
        if (isValidDate(tsCandidate)) timestamp = tsCandidate;
    }

    return timestamp;
};




/**
 * Extract array of [lon, lat] positions from igc file object.
 */
export const extract2DTrack = (igc: IGCFile): [number, number][] => {
    const validFixes = igc.fixes.filter((fix) => fix.valid);
    return validFixes.map((fix) => [fix.longitude, fix.latitude]);
};
