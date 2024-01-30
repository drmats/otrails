/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import {
    map,
    promisePool,
    type PromisePoolResult,
} from "@xcmats/js-toolbox/async";
import { isArray, isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { exportDataStructure } from "~common/app/models/garmin";
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
import { startDevCli } from "~cli/actions/dev";
import type { ComplexValue } from "~common/lib/type";
import { isPlainRecord } from "~common/lib/struct";
import { ensureDirectory, readJSON } from "~common/lib/fs";
import { get, collectData } from "~common/lib/http";
import { sha256 } from "~common/lib/uuid";




// success type
type ImageOk = { url: string; data: Buffer };

// failure type
type ImageErr = { url: string; error: unknown };

// promise pool size (request parallelization)
const DEFAULT_POOL_SIZE = 32;




/**
 * Fetch all export-data images.
 */
export const fetchImages: CliAction<{
    userShortId?: string;
}> = async ({ userShortId }) => {

    const { pgp, vars } = useMemory();

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

        // fitness directory
        const fitnessDir = join(extractDir, exportDataStructure.fitnessDir);

        // image metadata files
        const imageMetaFilenames =
            (await readdir(fitnessDir))
                .filter((f) => exportDataStructure.imagesFilePattern.test(f))
                .map((f) => join(fitnessDir, f));

        // image files destination directory
        const imagesDir = join(extractDir, exportDataStructure.imagesDir);
        await ensureDirectory(imagesDir);

        // get-image result handler
        const handleImageResult = async (
            result: PromisePoolResult<ImageOk, ImageErr>,
        ): Promise<void> => {
            if (result.status !== "fulfilled") return;
            const imageFilename = [
                sha256(result.value.url),
                extname(result.value.url),
            ].join("");
            return await writeFile(
                join(imagesDir, imageFilename),
                result.value.data,
            );
        };

        // process file-by-file
        await map(imageMetaFilenames) (async (imageMetaFilename) => {

            info("processing: "); shoutnl(imageMetaFilename);

            // metadata file contents (parsed)
            const imageMetaFile = await readJSON<ComplexValue[]>(imageMetaFilename);
            if (!isArray(imageMetaFile)) {
                throw new Error(`wrong structure: ${imageMetaFilename}`);
            }
            info("number of entries: "); shoutnl(imageMetaFile.length);

            // execution pool
            const pool = promisePool<ImageOk, ImageErr>(DEFAULT_POOL_SIZE);

            // process entries
            await map(imageMetaFile) (async (imageEntry, i) => {

                // progress-bar
                progress(i + 1, imageMetaFile.length + 1);

                // data-check
                if (!isPlainRecord(imageEntry) || !isString(imageEntry.url)) {
                    return;
                }
                const url = imageEntry.url;

                // schedule request and data-collecting
                const result = await pool.exec(async () => ({
                    url, data: await collectData(await get(url)),
                }));

                // process result (save file)
                await handleImageResult(result);

            });

            // await for all entries still "in flight"
            info(" "); const spinner = createAutoSpinner();
            await map(await pool.finish()) (handleImageResult);

            // one `imageMetaFilename` processed ok
            spinner.dispose(); infonl(); oknl("DONE");

            // start cli after each pass
            await startDevCli({
                userShortId, fitnessDir,
                imageMetaFilenames, imageMetaFilename,
                imageMetaFile,
            });

        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
