/**
 * Redux root listeners assembly.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import type { ThunkType } from "~web/store/types";
import appListener from "~web/app/listener";
import layoutListener from "~web/layout/listener";
import routerListener from "~web/router/listener";




/**
 * Application external-world listener list.
 */
const listeners = [
    appListener,
    layoutListener,
    routerListener,
] as const;




/**
 * Attach all application-specific listeners.
 */
export const attachListeners: ThunkType<void> = (dispatch, getState, ctx) => {
    listeners.forEach((listener) => listener(dispatch, getState, ctx));
};
