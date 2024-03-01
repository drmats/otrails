/**
 * App component state shape description.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { AppState } from "~web/app/types";




/**
 * App component initial state.
 */
export default {

    // is whole application not ready, initializing or ready?
    state: AppState.NOT_READY,

    // is application visible (browser tab active)?
    visible: true,

    // last error
    error: undefined as string | undefined,

    // last state-change timestamp (global - any action)
    tick: Date.now(),

    // developer mode (user-facing, controling visibility of additional menus)
    devmode: false,

    // window header / page title
    topbarTitle: "",

};
