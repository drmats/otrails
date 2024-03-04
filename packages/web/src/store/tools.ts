/**
 * Redux devtools integration.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { compose } from "redux";
import { identity, partial, pipe } from "@xcmats/js-toolbox/func";
import { nullToUndefined } from "@xcmats/js-toolbox/type";
import { devEnv } from "@xcmats/js-toolbox/utils";

import type { ComplexRecord } from "~common/lib/struct";
import { SS_KEY } from "~web/root/config";




/**
 * Obtain redux devtools extension composer if it's available.
 * Use regular one otherwise.
 */
export const getComposer = (): typeof compose =>
    devEnv() ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose :
        compose;




/**
 * Check availability of redux devtools extension.
 */
export const reduxDevtoolsAvailable = (): boolean =>
    Boolean(window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__);




/**
 * Restore current Redux state from `sessionStorage`.
 * Also apply `transform` function to set necessary defaults.
 */
export const loadStateFromSessionStorage = <
    LS extends ComplexRecord,
    S extends ComplexRecord | undefined,
>(transform?: (loadedState: LS) => S): S | undefined => {
    try {
        return pipe(SS_KEY) (
            sessionStorage.getItem.bind(sessionStorage),
            JSON.parse,
            transform ?? identity,
            nullToUndefined,
        ) as S;
    } catch {
        // in case of SSR
        return undefined;
    }
};




/**
 * Persists current state of the application.
 */
export const saveStateToSessionStorage = <S extends ComplexRecord>(
    state: S,
): undefined => {
    try {
        return pipe(state) (
            JSON.stringify,
            partial(sessionStorage.setItem.bind(sessionStorage)) (SS_KEY),
        ) as undefined;
    } catch {
        // in case of SSR
        return undefined;
    }
};




/**
 * TS - global declaration merge for window.
 */
declare global {

    interface Window {
        readonly __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }

}
