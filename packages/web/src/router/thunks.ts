/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ComplexRecord } from "~common/lib/struct";
import type { ThunkType } from "~web/store/types";
import { SPA_HASH_SEPARATOR } from "~web/router/constants";
import { formatRoute } from "~web/router/functions";
import {
    selectBrowserHash,
    selectRawSpaRoute,
    selectSpaRouteState,
} from "~web/router/selectors";




/**
 * Basic SPA routing - push browser hash.
 */
export const pushBrowserHash = (
    hash: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { act }) => {
        if (selectBrowserHash(getState()) !== hash) {
            const pathname = (new URL(document.URL)).pathname;
            const h = hash.length === 0 ? pathname : formatRoute(hash);
            history.pushState(browserState, "", h);
            act.router.SET_HASH(hash);
            act.router.SET_ROUTE_STATE(browserState);
        }
    };




/**
 * Basic SPA routing - replace browser hash.
 */
export const replaceBrowserHash = (
    hash: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { act }) => {
        if (selectBrowserHash(getState()) !== hash) {
            const pathname = (new URL(document.URL)).pathname;
            const h = hash.length === 0 ? pathname : formatRoute(hash);
            history.replaceState(browserState, "", h);
            act.router.SET_HASH(hash);
            act.router.SET_ROUTE_STATE(browserState);
        }
    };




/**
 * Basic SPA routing - replace browser route state.
 */
export const replaceBrowserState = (
    browserState?: ComplexRecord,
    opts?: { cache?: boolean },
): ThunkType =>
    async (_d, getState, { act }) => {
        history.replaceState(browserState, "");
        act.router.SET_ROUTE_STATE(
            browserState,
            opts?.cache ? selectRawSpaRoute(getState()) : undefined,
        );
    };




/**
 * Basic SPA routing - merge new state into existing browser route state.
 */
export const mergeBrowserState = (
    incomingState: ComplexRecord,
    opts?: { cache?: boolean },
): ThunkType =>
    async (_d, getState, { act }) => {
        const state = getState();
        const currentState = selectSpaRouteState(state);
        const newState = { ...currentState, ...incomingState };
        history.replaceState(newState, "");
        act.router.SET_ROUTE_STATE(
            newState,
            opts?.cache ? selectRawSpaRoute(state) : undefined,
        );
    };




/**
 * Basic SPA routing - push spa route.
 */
export const pushSpaRoute = (
    route: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { tnk }) => {
        const [r, h] = selectBrowserHash(getState()).split(SPA_HASH_SEPARATOR);
        if (r !== route) {
            if (h && h !== "") {
                await tnk.router.pushBrowserHash(
                    [route, h].join(SPA_HASH_SEPARATOR),
                    browserState,
                );
            } else {
                await tnk.router.pushBrowserHash(route, browserState);
            }
        }
    };




/**
 * Basic SPA routing - replace spa route.
 */
export const replaceSpaRoute = (
    route: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { tnk }) => {
        const [r, h] = selectBrowserHash(getState()).split(SPA_HASH_SEPARATOR);
        if (r !== route) {
            if (h && h !== "") {
                await tnk.router.replaceBrowserHash(
                    [route, h].join(SPA_HASH_SEPARATOR),
                    browserState,
                );
            } else {
                await tnk.router.replaceBrowserHash(route, browserState);
            }
        }
    };




/**
 * Basic SPA routing - push spa hash.
 */
export const pushSpaHash = (
    hash: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { tnk }) => {
        const [r, h] = selectBrowserHash(getState()).split(SPA_HASH_SEPARATOR);
        if (h !== hash) {
            if (hash !== "") {
                await tnk.router.pushBrowserHash(
                    [r, hash].join(SPA_HASH_SEPARATOR),
                    browserState,
                );
            } else {
                await tnk.router.pushBrowserHash(r, browserState);
            }
        }
    };




/**
 * Basic SPA routing - replace spa hash.
 */
export const replaceSpaHash = (
    hash: string,
    browserState?: ComplexRecord,
): ThunkType =>
    async (_d, getState, { tnk }) => {
        const [r, h] = selectBrowserHash(getState()).split(SPA_HASH_SEPARATOR);
        if (h !== hash) {
            if (hash !== "") {
                await tnk.router.replaceBrowserHash(
                    [r, hash].join(SPA_HASH_SEPARATOR),
                    browserState,
                );
            } else {
                await tnk.router.replaceBrowserHash(r, browserState);
            }
        }
    };
