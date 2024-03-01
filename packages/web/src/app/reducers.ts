/**
 * App component reducers.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { Action } from "red-g";
import { isWithPayload, sliceReducer } from "red-g";
import { produce } from "immer";
import { isObject, toBool } from "@xcmats/js-toolbox/type";

import initState from "~web/app/state";
import act from "~web/app/actions";
import { AppState } from "~web/app/types";




/**
 * App component reducer.
 */
export default sliceReducer(initState) ((slice) => slice
    // full state reset
    .handle(act.RESET, () => initState)

    // app readiness
    .handle(act.NOT_READY, produce((draft) => {
        draft.state = AppState.NOT_READY;
    }))
    .handle(act.INITIALIZING, produce((draft) => {
        draft.state = AppState.INITIALIZING;
    }))
    .handle(act.READY, produce((draft) => { draft.state = AppState.READY; }))

    // app visibility
    .handle(act.VISIBLE, produce((draft) => { draft.visible = true; }))
    .handle(act.HIDDEN, produce((draft) => { draft.visible = false; }))

    // developer mode
    .handle(act.DEVMODE_ENABLE, produce((draft) => { draft.devmode = true; }))
    .handle(act.DEVMODE_DISABLE, produce((draft) => { draft.devmode = false; }))

    // ...
    .handle(act.SET_TOPBAR_TITLE, produce((draft, { title }) => {
        draft.topbarTitle = title;
    }))

    // error handling
    .handle(act.CLEAR_ERROR, produce((draft) => { delete draft.error; }))
    .match(
        (action): action is Action<{ error: string }> =>
            action.type.startsWith("App/") &&
            isWithPayload(action) &&
            isObject(action.payload) && toBool(action.payload.error),
        produce((draft, { error }) => { draft.error = error; }),
    )

    // global matcher
    .match(
        () => true,
        produce((draft) => { draft.tick = Date.now(); }),
    ),
);
