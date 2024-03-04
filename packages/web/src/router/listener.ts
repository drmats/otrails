/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { tail } from "@xcmats/js-toolbox/array";
import { pipe } from "@xcmats/js-toolbox/func";
import { isNumber, isObject } from "@xcmats/js-toolbox/type";

import { SCREEN } from "~common/app/api";
import { type ComplexRecord, isComplexRecord } from "~common/lib/struct";
import type { ThunkType } from "~web/store/types";
import { selectSpaRouteCache } from "~web/router/selectors";




/**
 * Router and router-related listeners.
 */
const setupListener: ThunkType<void> = (_d, getState, { act, mut }) => {

    // handle url hash change - update redux state
    const browserHashToRedux = () =>
        pipe(document.URL) (
            (url: string) => new URL(url),
            (urlObj: URL) => urlObj.hash,
            (hash: string) => hash.startsWith("#") ? tail(hash) : hash,
            (browserHash: string) => {
                act.router.SET_HASH(browserHash);
                return browserHash;
            },
        ) as string;

    // router setup
    act.router.SET_TREE(Object.values(SCREEN));

    // initial hash synchronization
    browserHashToRedux();

    // initialize router mutable state
    mut.router = { pageIndex: 0 };

    // initialize router object in history.state
    let mergedHistoryState: { router: Mut["router"] } & ComplexRecord = {
        router: mut.router,
        ...(isComplexRecord(history.state) ? history.state : {}),
    };
    mut.router = mergedHistoryState.router;
    history.replaceState(mergedHistoryState, "");
    act.router.SET_ROUTE_STATE(mergedHistoryState);

    // hash and route.state synchronization on every external change
    window.addEventListener("hashchange", () => {
        browserHashToRedux();
        const routeCache = selectSpaRouteCache(getState());

        // manual url input detection
        if (
            isObject(history.state) &&
            isObject(history.state.router) &&
            isNumber(history.state.router.pageIndex)
        ) {
            mut.router.pageIndex = history.state.router.pageIndex;
        } else {
            mut.router.pageIndex += 1;
        }

        mergedHistoryState = {
            ...(isObject(history.state) ? history.state : {}),
            ...routeCache,
            router: mut.router,
        };
        history.replaceState(mergedHistoryState, "");
        act.router.SET_ROUTE_STATE(mergedHistoryState as ComplexRecord);
    });

};

export default setupListener;




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Augmenting mutable subcontext.
     */
    interface Mut {
        router: { pageIndex: number };
    }

}
