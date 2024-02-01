/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readFile } from "node:fs/promises";
import FitParser, { type FitObject } from "fit-file-parser";

import { fsWalk } from "~common/lib/fs";




/**
 * Get all fit filenames from given directory.
 */
export const getFitFilenames = async (path: string): Promise<string[]> => {
    const fitFilenames: string[] = [];
    await fsWalk(path, async (_, name) => {
        if (name.endsWith(".fit")) fitFilenames.push(name);
    }, 0);
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
