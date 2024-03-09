/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";

import type { ComplexRecord } from "~common/lib/struct";




/**
 * Router component action types.
 */
export enum RouterActionType {

    RESET = "Router/RESET",

    SET_TREE = "Router/SET_TREE",

    SET_HASH = "Router/SET_HASH",

    SET_INCOMING_HASH = "Router/SET_INCOMING_HASH",

    SET_ROUTE_STATE = "Router/SET_ROUTE_STATE",

    RESET_CACHE = "Router/RESET_CACHE",

}




/**
 * Router component action creators.
 */
export default actionCreators(RouterActionType, {

    SET_TREE: (routes: string[]) => ({ routes }),

    SET_HASH: (hash: string) => ({ hash }),

    SET_INCOMING_HASH: (hash: string) => ({ hash }),

    SET_ROUTE_STATE: (routeState?: ComplexRecord, route?: string) => ({
        route, routeState,
    }),

});
