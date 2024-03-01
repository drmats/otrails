/**
 * App component thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";
import { inIframe } from "~web/layout/lib";




/**
 * Application init.
 */
export const initialize = (): ThunkType =>
    async (_d, _getState, { act, logger, tnk }) => {
        // go...
        act.app.INITIALIZING();

        // detect if embedded in iframe, or not
        if (inIframe()) act.layout.SET_IN_IFRAME(true);

        // take care of color theme
        await tnk.layout.readThemePreference();
        await tnk.layout.syncTheme();

        // take care of language
        await tnk.layout.detectClientThemeLanguage();

        // all done
        act.app.READY();
        logger.info("Ready! ✅");
    };
