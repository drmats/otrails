/**
 * Root redux logic - combined actions, reducers and thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { combineReducers } from "redux";

import appActions from "~web/app/actions";
import appReducers from "~web/app/reducers";
import * as appThunks from "~web/app/thunks";

import layoutActions from "~web/layout/actions";
import layoutReducers from "~web/layout/reducers";
import * as layoutThunks from "~web/layout/thunks";

import mapActions from "~web/map/actions";
import mapReducers from "~web/map/reducers";

import networkActions from "~web/network/actions";
import networkReducers from "~web/network/reducers";
import * as networkThunks from "~web/network/thunks";

import routerActions from "~web/router/actions";
import routerReducers from "~web/router/reducers";
import * as routerThunks from "~web/router/thunks";




/**
 * Application actions tree.
 */
export const action = {
    app: appActions,
    layout: layoutActions,
    map: mapActions,
    network: networkActions,
    router: routerActions,
} as const;




/**
 * Application reducers tree.
 */
export const rootReducer = combineReducers({
    app: appReducers,
    layout: layoutReducers,
    map: mapReducers,
    network: networkReducers,
    router: routerReducers,
} as const);




/**
 * Application thunks tree.
 */
export const thunk = {
    app: appThunks,
    layout: layoutThunks,
    network: networkThunks,
    router: routerThunks,
} as const;
