/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    isFunction,
    isObject,
    isString,
    toBool,
} from "@xcmats/js-toolbox/type";

import type { ComplexValue } from "~common/lib/type";
import {
    isPlainRecord,
    type ComplexRecord,
    type PlainRecord,
} from "~common/lib/struct";
import {
    parseQueryString,
    stringifyQuery,
    substitute,
} from "~common/framework/routing";
import type { StateManagement } from "~web/common/types";
import { appMemory } from "~web/root/memory";
import {
    selectIncomingSpaQueryMapping,
    selectSpaCanGoBack,
    selectSpaHash,
    selectSpaQueryMapping,
    selectSpaRoute,
    selectSpaRouteCache,
    selectSpaRouteState,
} from "~web/router/selectors";




/**
 * ...
 */
const { tnk, store } = appMemory();




/**
 * Augment history.state with router.pageIndex.
 */
const augment = (
    state?: ComplexRecord,
    opts?: { inc?: boolean },
): ComplexRecord => {
    const { mut } = appMemory();
    if (opts?.inc) mut.router.pageIndex += 1;
    return {
        router: mut.router,
        ...(isObject(state) ? state : {}),
    };
};




/**
 * SPA router - hook interface for navigation.
 */
export const useSpaNavigation = () => useMemo(() => ({

    // ...
    back: history.back.bind(history),

    // ...
    forward: history.forward.bind(history),

    // ...
    go: history.go.bind(history),

    // ...
    to: (
        route: string,
        opts?: {
            resetQuery?: boolean;
            resetHash?: boolean;
            query?: PlainRecord;
            hash?: string;
            state?: ComplexRecord;
            params?: Partial<Record<string, string>>;
        },
    ) => {
        const newState = augment(opts?.state, { inc: true });
        void tnk.router.pushSpaRoute(
            substitute(route, opts?.params), newState,
        );
        if (toBool(opts?.resetQuery) || toBool(opts?.resetHash))
            void tnk.router.replaceSpaHash("", newState);
        else if (opts?.query)
            void tnk.router.replaceSpaHash(
                stringifyQuery(opts.query), newState,
            );
        else if (opts?.hash)
            void tnk.router.replaceSpaHash(opts.hash, newState);
    },

    // ...
    replace: (
        route: string,
        opts?: {
            resetQuery?: boolean;
            resetHash?: boolean;
            query?: PlainRecord;
            hash?: string;
            state?: ComplexRecord;
            params?: Partial<Record<string, string>>;
        },
    ) => {
        const newState = augment(opts?.state);
        void tnk.router.replaceSpaRoute(
            substitute(route, opts?.params), newState,
        );
        if (toBool(opts?.resetQuery) || toBool(opts?.resetHash))
            void tnk.router.replaceSpaHash("", newState);
        else if (opts?.query)
            void tnk.router.replaceSpaHash(
                stringifyQuery(opts.query), newState,
            );
        else if (opts?.hash)
            void tnk.router.replaceSpaHash(opts.hash, newState);
    },

    // ...
    replaceState: (opts?: { state?: ComplexRecord; cache?: boolean }) => {
        void tnk.router.replaceBrowserState(
            augment(opts?.state), { cache: opts?.cache },
        );
    },

    // ...
    mergeState: (opts: { state: ComplexRecord; cache?: boolean }) => {
        void tnk.router.mergeBrowserState(
            augment(opts.state), { cache: opts.cache },
        );
    },

    // ...
    pushHash: (
        hash: string,
        opts?: { state?: ComplexRecord },
    ) => {
        const newState = augment(opts?.state, { inc: true });
        void tnk.router.pushSpaHash(hash, newState);
    },

    // ...
    replaceHash: (
        hash: string | ((current: string) => string),
        opts?: { state?: ComplexRecord },
    ) => {
        const newState = augment(opts?.state);
        if (isString(hash)) {
            void tnk.router.replaceSpaHash(hash, newState);
        } else {
            void tnk.router.replaceSpaHash(
                hash(selectSpaHash(store.getState())),
                newState,
            );
        }
    },

    // ...
    resetHash: () => void tnk.router.replaceSpaHash(""),

    // ...
    pushQuery: (
        query: PlainRecord,
        opts?: { state?: ComplexRecord },
    ) => {
        const newState = augment(opts?.state, { inc: true });
        void tnk.router.pushSpaHash(stringifyQuery(query), newState);
    },

    // ...
    replaceQuery: (
        query: PlainRecord | ((current: PlainRecord) => PlainRecord),
        opts?: { state?: ComplexRecord },
    ) => {
        const newState = augment(opts?.state);
        if (isPlainRecord(query)) {
            void tnk.router.replaceSpaHash(stringifyQuery(query), newState);
        } else {
            void tnk.router.replaceSpaHash(
                stringifyQuery(
                    query(parseQueryString(selectSpaHash(store.getState()))),
                ),
                newState,
            );
        }
    },

    // ...
    resetQuery: () => void tnk.router.replaceSpaHash(""),

    // ...
    historyLength: () => history.length,

}), []);




/**
 * SPA router - hook interface for routes and hashes.
 */
export const useSpaRoute = () => {
    const route = useSelector(selectSpaRoute);
    const hash = useSelector(selectSpaHash);
    const query = useSelector(selectSpaQueryMapping);

    return useMemo(() => ({ ...route, hash, query }), [hash, query, route]);
};




/**
 * SPA router - hook interface for parsed query string.
 */
export const useSpaQuery = () => useSelector(selectSpaQueryMapping);




/**
 * SPA router - hook interface for parsed query string
 * (manual address bar change).
 */
export const useIncomingSpaQuery = () =>
    useSelector(selectIncomingSpaQueryMapping);




/**
 * SPA router - hook interface for states.
 */
export const useSpaRouteState = () => useSelector(selectSpaRouteState);




/**
 * SPA router - hook interface for answering question:
 * can `navigation.back()` be safely invoked without leaving app context
 * (i.e. going to page preceeding spa app in browser's history).
 */
export const useSpaCanGoBack = () => useSelector(selectSpaCanGoBack);




/**
 * SPA router - hook interface for spa-state-backed named states.
 *
 * Simulates react's `useState()` hook, but caches all state changes inside
 * browser's history state object and inside router cache (in-redux).
 */
export function useNamedState<S = undefined> (
    name: string,
    initialState?: undefined,
    opts?: { cache?: boolean },
): StateManagement<S>;
export function useNamedState<S> (
    name: string,
    initialState: S | (() => S),
    opts?: { cache?: boolean },
): StateManagement<S>;
export function useNamedState<S extends ComplexValue | undefined> (
    name: string,
    initialState?: S | (() => S),
    opts?: { cache?: boolean },
): StateManagement<S | undefined> {
    const navigate = useSpaNavigation();
    const route = useSpaRoute();
    const rawRouteRef = useRef(route.raw);
    const routeState = useSpaRouteState();
    const routeCache = useSelector(selectSpaRouteCache);


    const nameRef = useRef(name);
    const initVal = useMemo(
        () => isFunction(initialState) ? initialState() : initialState,
        [initialState],
    );
    const optCacheRef = useRef(opts?.cache ?? true);


    type SyncFlag =
        | "start"
        | "initToState"
        | "cacheToState"
        | "currentToAll"
        | "done";
    const [syncFlag, setSyncFlag] = useState<SyncFlag>("start");
    const syncFlagRef = useRef<SyncFlag>(syncFlag);


    const stateRef = useRef<S | undefined>(undefined);
    const state = useMemo(
        () => {
            // do nothing if triggered by state-ref/history-state/cache sync flag
            if ([
                "initToState",
                "cacheToState",
                "currentToAll",
            ].includes(syncFlag))
                return stateRef.current;

            // extract relevant state/cache values
            const namedState = routeState[nameRef.current] as S | undefined;
            const namedCache = routeCache[nameRef.current] as S | undefined;

            if (typeof stateRef.current !== "undefined") {
                if (rawRouteRef.current !== route.raw) {
                    rawRouteRef.current = route.raw;
                    // If state-ref contains value but history-state/cache
                    // don't then it means route has changed but outer component
                    // is still mounted, so state-ref => history-state/cache
                    // synchronization has to be performed.
                    setSyncFlag("currentToAll");
                    syncFlagRef.current = "currentToAll";
                }
                return stateRef.current;
            }

            // initial hook call - state-ref is empty
            if (typeof namedState === "undefined") {
                if (!optCacheRef.current || typeof namedCache === "undefined") {
                    // [1] Schedule route state update to be executed >>after<<
                    // calling component finish rendering - prevent "cannot
                    // update a component while rendering a different
                    // component" error (it's forbidden to update other
                    // components while rendering a component - e.g.
                    // dispatching redux action).
                    if (syncFlag === "start") {
                        setSyncFlag("initToState");
                        syncFlagRef.current = "initToState";
                    }
                    stateRef.current = initVal;
                    return initVal;
                }
                // [2] Same as [1].
                if (syncFlag === "start") {
                    setSyncFlag("cacheToState");
                    syncFlagRef.current = "cacheToState";
                }
                stateRef.current = namedCache;
                return namedCache;
            }

            stateRef.current = namedState;
            return namedState;
        },
        [route.raw, routeCache, routeState, syncFlag, initVal],
    );


    // state-ref/history-state/cache sync effect
    useEffect(() => {
        if (
            syncFlag === "initToState" &&
            syncFlagRef.current === "initToState"
        ) {
            navigate.mergeState({
                state: { [nameRef.current]: initVal },
                cache: optCacheRef.current,
            });
        } else if (
            syncFlag === "cacheToState" &&
            syncFlagRef.current === "cacheToState"
        ) {
            navigate.mergeState({
                state: { [nameRef.current]: routeCache[nameRef.current] as S },
            });
        } else if (
            syncFlag === "currentToAll" &&
            syncFlagRef.current === "currentToAll"
        ) {
            navigate.mergeState({
                state: { [nameRef.current]: stateRef.current },
                cache: optCacheRef.current,
            });
            setSyncFlag("done");
            syncFlagRef.current = "done";
        }
    }, [initVal, routeCache, syncFlag]);


    // stable setter
    const setState = useCallback<StateManagement<S | undefined>[1]>((s) => {
        const next = isFunction(s) ? s(stateRef.current) : s;
        // Cancel any scheduled route state updates which could
        // overwrite result of current state update.
        if (syncFlagRef.current !== "done") {
            setSyncFlag("done");
            syncFlagRef.current = "done";
        }
        stateRef.current = next;
        navigate.mergeState({
            state: { [nameRef.current]: next },
            cache: optCacheRef.current,
        });
    }, []);


    return useMemo(() => [state, setState], [state, setState]);
}
