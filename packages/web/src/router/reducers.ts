/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { sliceReducer } from "red-g";
import { produce } from "immer";
import { isString } from "@xcmats/js-toolbox/type";

import { buildRTree } from "~common/framework/routing";
import initState from "~web/router/state";
import act from "~web/router/actions";




/**
 * Router component reducer.
 */
export default sliceReducer(initState) ((slice) => slice

    // full state reset
    .handle(act.RESET, () => initState)

    // router setup
    .handle(act.SET_TREE, produce((draft, { routes }) => {
        draft.tree = buildRTree(routes);
    }))

    // url hash handling
    .handle(act.SET_HASH, produce((draft, { hash }) => {
        draft.hash = hash;
    }))

    // incoming url hash handling (manual address bar changes)
    .handle(act.SET_INCOMING_HASH, produce((draft, { hash }) => {
        draft.incomingHash = hash;
    }))

    // incoming url hash handling change
    .handle(act.SET_INCOMING_HASH_CHANGE, produce((draft, { ts }) => {
        draft.incomingHashChange = ts;
    }))

    // url state and cache handling
    .handle(act.SET_ROUTE_STATE, produce((draft, { route, routeState }) => {
        const stateString = JSON.stringify(routeState);
        draft.routeState = stateString;
        if (isString(route)) draft.cache[route] = stateString;
    }))

    // cache cleanup
    .handle(act.RESET_CACHE, produce((draft) => {
        draft.cache = {};
    })),

);
