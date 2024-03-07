/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { isArray, isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { oknl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { initProxyTiles } from "~cli/actions/initProxyTiles";
import { map } from "@xcmats/js-toolbox/async";
import { isFile, readJSON } from "~common/lib/fs";




/**
 * ...
 */
const RESOURCES_FILE = "proxy-tile-resources.json";




/**
 * Initialize set of raster base maps (cached proxy tiles).
 */
export const initAllProxyTiles: CliAction = async () => {

    const { vars } = useMemory();

    // extract process configuration variables
    const { staticDir } = vars;

    try {

        // check variables validity
        if (!isString(staticDir)) {
            throw new Error("Missing or malformed [staticDir] variable.");
        }

        // resource file location
        const resourcesFile = join(staticDir, RESOURCES_FILE);

        // check resource file presence
        if (!await isFile(resourcesFile)) {
            throw new Error(`Missing [${RESOURCES_FILE}] file.`);
        }

        // read and parse resources file
        const resources = await readJSON(resourcesFile);

        // check parsed file strucure
        if (
            !isArray(resources.xyz) ||
            !resources.xyz.every((entry) =>
                isArray(entry) && isString(entry[0]) && isString(entry[1]),
            )
        ) {
            throw new Error(`Wrong [${RESOURCES_FILE}] structure.`);
        }

        // process resources
        await map(resources.xyz) (async (r) => {
            if (isArray(r) && isString(r[0]) && isString(r[1])) {
                await initProxyTiles({ name: r[0], url: r[1] });
            }
        });

        oknl("DONE");

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
