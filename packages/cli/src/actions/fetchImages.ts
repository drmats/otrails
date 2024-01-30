/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { map } from "@xcmats/js-toolbox/async";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { exportDataStructure } from "~common/app/models/garmin";
import { useMemory } from "~cli/setup/main";
import { info, shoutnl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { startDevCli } from "~cli/actions/dev";
import { readJSON } from "~common/lib/fs";




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
            throw new Error("Missing or malformad extract variable.");
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
        const imageMetaFiles =
            (await readdir(fitnessDir))
                .filter((f) => exportDataStructure.imagesFilePattern.test(f))
                .map((f) => join(fitnessDir, f));

        // process file-by-file
        await map(imageMetaFiles) (async (imageMetaFileName) => {
            info("processing: "); shoutnl(imageMetaFileName);

            const imageMetaFile = await readJSON(imageMetaFileName);

            // start cli
            await startDevCli({
                userShortId, fitnessDir,
                imageMetaFiles, imageMetaFileName, imageMetaFile,
            });

        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
