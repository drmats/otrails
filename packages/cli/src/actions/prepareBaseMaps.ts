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
    shoutnl,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { initProxyTiles } from "~cli/actions/initProxyTiles";
import { isFile } from "~common/lib/fs";




/**
 * Base maps.
 */
export const prepareBaseMaps: CliAction = async () => {

    const { vars } = useMemory();

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
        const neVecDataFile = join(tilesDir, "natural_earth.vector.mbtiles");
        if (!await isFile(neVecDataFile)) {
            await getFile(
                "https://github.com/lukasmartinelli/naturalearthtiles/releases/download/v1.0/natural_earth.vector.mbtiles",
                neVecDataFile,
            );
        }
        spinner.dispose(); infonl();

        info("setting up: "); shout("natural earth shaded relief");
        info(" "); spinner = createAutoSpinner();
        const neShadeDataFile = join(tilesDir, "natural_earth_2_shaded_relief.raster.mbtiles");
        if (!await isFile(neShadeDataFile)) {
            await getFile(
                "https://github.com/lukasmartinelli/naturalearthtiles/releases/download/v1.0/natural_earth_2_shaded_relief.raster.mbtiles",
                neShadeDataFile,
            );
        }
        spinner.dispose(); infonl();

        info("initializing: "); shoutnl("open data elevation tiles");
        await initProxyTiles({
            name: "open-data-elevation-tiles.raster-dem",
            url: "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
            type: "raster-dem",
            encoding: "terrarium",
        });

        oknl("DONE");

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
