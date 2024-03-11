/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createSelector } from "reselect";
import { head, last } from "@xcmats/js-toolbox/array";
import { handleException } from "@xcmats/js-toolbox/func";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import type { RootState } from "~web/store/types";
import { access, type ComplexRecord } from "~common/lib/struct";
import { hashToSpaRoute } from "~web/router/lib";
import {
    getAllRoutes,
    matchRoute,
    parseQueryString,
} from "~common/framework/routing";




/**
 * ...
 */
export const selectTree = (s: RootState) => s.router.tree;




/**
 * ...
 */
export const selectKnownSpaRoutes = createSelector(
    [selectTree],
    (tree) => getAllRoutes(tree),
);




/**
 * ...
 */
export const selectBrowserHash = (s: RootState) => s.router.hash;




/**
 * This selector triggers changes only when browser hash has been
 * manually changed in address bar by user. It is not reflecting changes
 * to url state done from within application thus in most cases it will contain
 * a different value than `router.hash`.
 */
export const selectIncomingBrowserHash = (s: RootState) =>
    s.router.incomingHash;




/**
 * Manual user interaction with browser hash detection. Changes always
 * (even if user typed-in exactly the same values).
 */
export const selectIncomingBrowserHashChange = (s: RootState) =>
    s.router.incomingHashChange;




/**
 * ...
 */
export const selectRawSpaRoute = createSelector(
    [selectBrowserHash],
    (browserHash) => head(hashToSpaRoute(browserHash)),
);




/**
 * ...
 */
export const selectSpaRoute = createSelector(
    [selectTree, selectRawSpaRoute],
    (tree, rawSpaRoute) => handleException(
        () => ({ ...matchRoute(tree, rawSpaRoute), raw: rawSpaRoute }),
        () => ({ matched: "", params: {}, raw: rawSpaRoute }),
    ) as {
        matched: string;
        params: Partial<Record<string, string>>;
        raw: string;
    },
);




/**
 * ...
 */
export const selectSpaHash = createSelector(
    [selectBrowserHash],
    (browserHash) => last(hashToSpaRoute(browserHash)),
);




/**
 * ...
 */
export const selectIncomingSpaHash = createSelector(
    [selectIncomingBrowserHash],
    (incomingBrowserHash) => last(hashToSpaRoute(incomingBrowserHash)),
);




/**
 * ...
 */
export const selectSpaQueryMapping = createSelector(
    [selectSpaHash],
    (spaHash) => parseQueryString(spaHash),
);




/**
 * ...
 */
export const selectIncomingSpaQueryMapping = createSelector(
    [selectIncomingSpaHash],
    (incomingSpaHash) => parseQueryString(incomingSpaHash),
);




/**
 * ...
 */
export const selectStringSpaRouteState = (s: RootState) => s.router.routeState;




/**
 * ...
 */
export const selectSpaRouteState = createSelector(
    [selectStringSpaRouteState],
    (stringRouteState) => {
        try { return (JSON.parse(stringRouteState) ?? {}) as ComplexRecord; }
        catch { return {} as ComplexRecord; }
    },
);




/**
 * ...
 */
export const selectSpaPageIndex = createSelector(
    [selectSpaRouteState],
    (routeState) => {
        const spaPageIndex = access(routeState, ["router", "pageIndex"], 0);
        if (isNumber(spaPageIndex)) return spaPageIndex;
        return 0;
    },
);




/**
 * ...
 */
export const selectSpaCanGoBack = createSelector(
    [selectSpaPageIndex],
    (spaPageIndex) => spaPageIndex > 0,
);




/**
 * ...
 */
export const selectFullSpaRouteCache = (s: RootState) => s.router.cache;




/**
 * ...
 */
export const selectStringSpaRouteCache = createSelector(
    [selectRawSpaRoute, selectFullSpaRouteCache],
    (route, routeCache) => routeCache[route],
);




/**
 * ...
 */
export const selectSpaRouteCache = createSelector(
    [selectStringSpaRouteCache],
    (routeCache) => {
        if (isString(routeCache)) {
            try { return (JSON.parse(routeCache) ?? {}) as ComplexRecord; }
            catch { return {} as ComplexRecord; }
        }
        return {} as ComplexRecord;
    },
);
