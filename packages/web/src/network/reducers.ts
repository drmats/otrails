/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { sliceReducer } from "red-g";
import { produce } from "immer";

import initState from "~web/network/state";
import act from "~web/network/actions";




/**
 * Network reducer.
 */
export default sliceReducer(initState) ((slice) => slice

    .handle(act.RESET, () => initState)

    .handle(act.START_REQUEST, produce((draft) => {
        draft.connections += 1;
    }))

    .handle(act.FINISH_REQUEST, produce((draft) => {
        draft.connections -= 1;
    }))

    .handle(act.SET_BACKEND_URL, produce((draft, { backendUrl }) => {
        draft.backendUrl = backendUrl;
    }))

    .handle(act.SET_PATH_PREFIX, produce((draft, { pathPrefix }) => {
        draft.pathPrefix = pathPrefix;
    }))

    .handle(act.REFRESH, produce((draft) => {
        draft.refreshTick += 1;
    })),

);
