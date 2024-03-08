/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. syntaxval. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { info, infonl, oknl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { isString } from "@xcmats/js-toolbox/type";
import { extractGarminData } from "~cli/actions/extractGarminData";
import { fetchImages } from "~cli/actions/fetchImages";
import { processSummaries } from "~cli/actions/processSummaries";
import { processTcxes } from "~cli/actions/processTcxes";
import { processFits } from "~cli/actions/processFits";
import { setupViews } from "~cli/actions/setupViews";
import { bakeTiles } from "~cli/actions/bakeTiles";
import { prepareBaseMaps } from "~cli/actions/prepareBaseMaps";

/**
 * Aggregate all Garmin user data processing actions.
 */
export const bakeGarminUserData: CliAction<{
    zipFileName?: string;
    userShortId?: string;
}> = async ({ zipFileName, userShortId }) => {

    try {

        // check arguments validity
        if (!isString(zipFileName) || !isString(userShortId)) {
            throw new Error("Provide [zipFileName] and [userShortId].");
        }

        infonl();
        info("Processing your data ...");
        await extractGarminData({ zipFileName, userShortId });
        await fetchImages({ userShortId });
        await processSummaries({ userShortId });
        await processTcxes({ userShortId });
        await processFits({ userShortId });
        await setupViews({});
        await bakeTiles({});
        await prepareBaseMaps({});
        infonl();
        oknl("Done.");
    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
