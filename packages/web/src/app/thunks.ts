/**
 * App component thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";
import {
    detectClientThemeLanguage,
    readThemePreference,
    syncTheme,
} from "~web/layout/thunks";
import { inIframe } from "~web/layout/lib";




/**
 * Application init.
 */
export const initialize = (): ThunkType =>
    async (dispatch, _getState, { act, logger }) => {
        // go...
        act.app.INITIALIZING();

        // detect if embedded in iframe, or not
        if (inIframe()) act.layout.SET_IN_IFRAME(true);

        // take care of color theme
        await dispatch(readThemePreference());
        await dispatch(syncTheme());

        // take care of language
        await dispatch(detectClientThemeLanguage());

        // all done
        act.app.READY();
        logger.info("Ready! ✅");
    };
