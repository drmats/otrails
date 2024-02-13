/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { getFile } from "~common/lib/http";
import {
    createAutoSpinner,
    info,
    infonl,
    oknl,
    shout,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";




/**
 * Base maps.
 */
export const prepareBaseMaps: CliAction = async () => {

    const { pgp, vars } = useMemory();

    // extract process configuration variables
    const { tilesDir } = vars;

    try {

        // check variables validity
        if (!isString(tilesDir)) {
            throw new Error("Missing or malformed [tilesDir] variable.");
        }

        let spinner;

        info("setting up: "); shout("natural earth vector data");
        info(" "); spinner = createAutoSpinner();
        await getFile(
            "https://github.com/lukasmartinelli/naturalearthtiles/releases/download/v1.0/natural_earth.vector.mbtiles",
            join(tilesDir, "natural_earth.vector.mbtiles"),
        );
        spinner.dispose(); infonl();

        info("setting up: "); shout("natural earth shaded relief");
        info(" "); spinner = createAutoSpinner();
        await getFile(
            "https://github.com/lukasmartinelli/naturalearthtiles/releases/download/v1.0/natural_earth_2_shaded_relief.raster.mbtiles",
            join(tilesDir, "natural_earth_2_shaded_relief.raster.mbtiles"),
        );
        spinner.dispose(); infonl();

        oknl("DONE");

        // fix http.get/getFile - destroy/close requrest
        setTimeout(() => process.exit(0), 500);

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
