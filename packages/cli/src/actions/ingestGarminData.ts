/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. syntaxval. 2024-present
 */

import type { CliAction } from "~common/framework/actions";
import { printError } from "~common/lib/error";
import { infonl, oknl } from "~common/lib/terminal";
import { extractGarminData } from "~cli/actions/extractGarminData";
import { fetchImages } from "~cli/actions/fetchImages";
import { processFits } from "~cli/actions/processFits";
import { processSummaries } from "~cli/actions/processSummaries";
import { processTcxes } from "~cli/actions/processTcxes";




/**
 * Aggregate all Garmin user data processing actions.
 */
export const ingestGarminData: CliAction<{
    zipFileName?: string;
    userShortId?: string;
}> = async ({ zipFileName, userShortId }) => {

    try {

        await extractGarminData({ zipFileName, userShortId });
        await fetchImages({ userShortId });
        await processSummaries({ userShortId });
        await processTcxes({ userShortId });
        await processFits({ userShortId });

        infonl();
        oknl("ALL DONE");

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return;

};
