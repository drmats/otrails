/**
 * App cmponent listeners.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";




/**
 * App component listener.
 */
const setupListener: ThunkType<void> = (_d, _getState, { act }) => {

    // handle application visibility change
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            act.app.VISIBLE();
        } else {
            act.app.HIDDEN();
        }
    });

};

export default setupListener;
