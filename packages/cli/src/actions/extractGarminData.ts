/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { unlink } from "node:fs/promises";
import { padRight, shorten } from "@xcmats/js-toolbox/string";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { infonl, progress } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { extract } from "~common/lib/zip";
import { fsWalk } from "~common/lib/fs";




/**
 * Uncompress contents of garmin export.
 */
export const extractGarminData: CliAction<{
    zipFileName?: string;
    userShortId?: string;
}> = async ({ zipFileName, userShortId }) => {

    const { pgp, vars } = useMemory();

    // extract process configuration variables
    const { exportsDir, extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(exportsDir) || !isString(extractsDir)) {
            throw new Error(
                "Missing or malformed [exportsDir]/[extractsDir] variables.",
            );
        }

        // check arguments validity
        if (!isString(zipFileName) || !isString(userShortId)) {
            throw new Error("Provide [zipFileName] and [userShortId].");
        }

        // extract destination directory
        const extractDestination = join(extractsDir, userShortId);

        // extract garmin export data file (zip) to `extract` directory
        await extract({
            source: join(exportsDir, zipFileName),
            destination: extractDestination,
            onEntry: ({ fileName, entriesRead, entryCount }) => progress(
                entriesRead, entryCount, shorten(padRight(fileName, 60), 60),
            ),
            onClose: infonl,
        });

        // find all compressed files inside destination dir
        // and extract them in place
        await fsWalk(
            extractDestination,
            async (dir, fileCandidate) => {
                if (fileCandidate.endsWith(".zip")) {
                    const zipExtractDst = join(extractDestination, ...dir);
                    const zipFileSrc = join(zipExtractDst, fileCandidate);
                    await extract({
                        source: zipFileSrc,
                        destination: zipExtractDst,
                        onEntry: ({ fileName, entriesRead, entryCount }) =>
                            progress(
                                entriesRead,
                                entryCount,
                                shorten(padRight(fileName, 60), 60),
                            ),
                        onClose: infonl,
                    });
                    await unlink(zipFileSrc);
                }
            },
        );

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
