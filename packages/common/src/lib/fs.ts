/**
 * Node data utils - fs.
 *
 * @module @xcmats/node-data-fs-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { mkdir, readdir, readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { ap, map } from "@xcmats/js-toolbox/async";
import { flow } from "@xcmats/js-toolbox/func";
import { bytesToString } from "@xcmats/js-toolbox/codec";

import { ComplexRecord } from "~common/lib/struct";




/**
 * Read file and parse it as a JSON object.
 *
 * @function readJSON
 * @param path file
 * @returns parsed object
 */
export const readJSON: <T = ComplexRecord>(
    path: string,
) => Promise<T> =
    flow(
        readFile,
        ap(bytesToString),
        ap(JSON.parse),
    );




/**
 * Recursively walk the filesystem tree and call `cb` for each file.
 * DFS. Don't go deeper than `maxDepth` param value (default `32`).
 */
export const fsWalk = async (
    root: string,
    cb: (dir: string[], name: string) => Promise<void>,
    maxDepth = 32,
): Promise<void> => {
    const aux = async (cd: string[]): Promise<void> => {
        const entries = await readdir(
            join(root, ...cd),
            { withFileTypes: true },
        );
        await map(entries) (async (e) => {
            if (e.isFile()) await cb(cd, e.name);
            else if (cd.length < maxDepth) await aux([...cd, e.name]);
        });
    };
    return aux([]);
};




/**
 * Read all files from a given directory and construct hash with form:
 * ```
 * { "filename": "filecontents" }
 * ```
 * Non-recursive.
 */
export const readAllFiles = async (
    path: string, nameMatch = /.*/,
): Promise<Record<string, string>> => {
    const contentMap: Record<string, string> = {};

    await fsWalk(path, async (_, name) => {
        if (nameMatch.test(name)) {
            contentMap[name] = bytesToString(
                await readFile(join(path, name)),
            );
        }
    }, 0);

    return contentMap;
};




/**
 * Ensure directory:
 * - if it exists, do nothing
 * - if it doesn't exist, create it
 * - throw error on conflict
 */
export const ensureDirectory = async (path: string): Promise<void> => {
    try {
        if (!(await stat(path)).isDirectory()) {
            throw new Error(`'${path}' exists and is not a directory.`);
        }
    } catch {
        await mkdir(path, { recursive: true });
    }
};




/**
 * Check if file exists.
 */
export const isFile = async (path: string): Promise<boolean> => {
    try {
        return (await stat(path)).isFile();
    } catch {
        return false;
    }
};
