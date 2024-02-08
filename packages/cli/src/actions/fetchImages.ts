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
import {
    activityImageToSqlParams,
    exportDataStructure,
    isActivityImage,
    type ActivityImage,
} from "~common/app/models/garmin";
import { useMemory } from "~cli/setup/memory";
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
import { ensureDirectory, isFile, readJSON } from "~common/lib/fs";
import { get, collectData } from "~common/lib/http";
import { sha256 } from "~common/lib/uuid";

import imageDdlQuery from "~common/app/queries/image.ddl.sql";
import imageInsertQuery from "~common/app/queries/image.insert.sql";




// success type
type ImageOk = { meta: ActivityImage; data?: Buffer };

// failure type
type ImageErr = { meta: ActivityImage; error: unknown };

// promise pool size (request parallelization)
const DEFAULT_POOL_SIZE = 32;




/**
 * Image file naming helper.
 */
const imageFilename = (url: string, imageId?: string): string =>
    isString(imageId)
        ? [imageId, extname(url)].join("")
        : [sha256(url), extname(url)].join("");




/**
 * Fetch all export-data images.
 */
export const fetchImages: CliAction<{
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

        // fitness directory (inside extract directory)
        const fitnessDir = join(extractDir, exportDataStructure.fitnessDir);

        // image metadata filenames
        const imageMetaFilenames =
            (await readdir(fitnessDir))
                .filter((f) => exportDataStructure.imagesFilePattern.test(f))
                .map((f) => join(fitnessDir, f));

        // ensure presence of image data table
        await db.none(sql(imageDdlQuery));

        // ensure image files destination directory
        const imagesDir = join(extractDir, exportDataStructure.imagesDir);
        await ensureDirectory(imagesDir);

        // get-image result handler
        const handleImageResult = async (
            result: PromisePoolResult<ImageOk, ImageErr>,
        ): Promise<void> => {

            // ignore empty results and rejections
            if (result.status !== "fulfilled") return;

            // insert metadata into database (ignore errors/conflicts)
            await db.one(
                sql(imageInsertQuery),
                activityImageToSqlParams(userShortId, result.value.meta),
            ).catch(() => { /* no-op */ });

            // store file on disk
            if (result.value.data) {
                await writeFile(
                    join(
                        imagesDir,
                        imageFilename(
                            result.value.meta.url,
                            result.value.meta.imageId,
                        ),
                    ),
                    result.value.data,
                );
            }

        };

        // process file-by-file
        await map(imageMetaFilenames) (async (imageMetaFilename) => {

            info("processing: "); shoutnl(imageMetaFilename);

            // metadata file contents (parsed)
            const imageMetaFile =
                await readJSON<ComplexValue[]>(imageMetaFilename);
            if (!isArray(imageMetaFile)) {
                throw new Error(`wrong structure: ${imageMetaFilename}`);
            }

            // execution pool
            const pool = promisePool<ImageOk, ImageErr>(DEFAULT_POOL_SIZE);

            // process entries
            info("number of entries: "); shoutnl(imageMetaFile.length);
            await map(imageMetaFile) (async (imageEntry, i) => {

                // progress-bar
                progress(i + 1, imageMetaFile.length);

                // data-check (do nothing on malformed data entry)
                if (!isActivityImage(imageEntry)) {
                    return;
                }

                // image-file-existence check
                const isImagePresent = await isFile(join(
                    imagesDir,
                    imageFilename(imageEntry.url, imageEntry.imageId),
                ));

                // schedule request and data-collecting
                // if image-file does not exist on disk
                const result = await pool.exec(async () => ({
                    meta: imageEntry,
                    data:
                        !isImagePresent
                            ? await collectData(await get(imageEntry.url))
                            : undefined,
                }));

                // process result (save file)
                await handleImageResult(result);

            });

            // await for all entries still "in flight"
            info(" "); const spinner = createAutoSpinner();
            await map(await pool.finish()) (handleImageResult);

            // one `imageMetaFilename` processed ok
            spinner.dispose(); infonl(); oknl("DONE");

        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
