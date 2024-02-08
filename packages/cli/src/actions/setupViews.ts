/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import {
    createAutoSpinner,
    info,
    infonl,
    oknl,
    shout,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";

import trackedActivityDdlQuery from "~common/app/queries/trackedActivity.ddl.sql";
import coverageDdlQuery from "~common/app/queries/coverage.ddl.sql";




/**
 * Setup database views.
 */
export const setupViews: CliAction = async () => {

    const { db, pgp, sql } = useMemory();

    try {

        let spinner;

        info("setting up: "); shout("views");
        info(" "); spinner = createAutoSpinner();
        await db.none(sql(trackedActivityDdlQuery));
        spinner.dispose(); infonl();

        info("computing: "); shout("hulls, mvt coordinates and intersections");
        info(" "); spinner = createAutoSpinner();
        await db.none(sql(coverageDdlQuery));
        spinner.dispose(); infonl();

        oknl("DONE");

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
