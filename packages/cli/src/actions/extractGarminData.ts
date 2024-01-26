/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { padRight, shorten } from "@xcmats/js-toolbox/string";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/main";
import { infonl, progress } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { extract } from "~common/lib/zip";




/**
 * Uncompress contents of garmin export.
 */
export const extractGarminData: CliAction<{
    name?: string;
    id?: string;
}> = async ({ name, id }) => {

    const { pgp, vars } = useMemory();

    // extract process configuration variables
    const { exportsDir, extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(exportsDir) || !isString(extractsDir)) {
            throw new Error("Missing or malformad export/extract variables.");
        }

        // check arguments validity
        if (!isString(name) || !isString(id)) {
            throw new Error("Provide [name] and [id].");
        }

        // extract garmin export data file (zip) to `extract` directory
        await extract({
            source: join(exportsDir, name),
            destination: join(extractsDir, id),
            onEntry: ({ fileName, entriesRead, entryCount }) => progress(
                entriesRead, entryCount, shorten(padRight(fileName, 60), 60),
            ),
            onClose: infonl,
        });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
