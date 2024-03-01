/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createSelector } from "reselect";

import type { RootState } from "~web/store/types";




export const selectIsRequestInFlight = (s: RootState) =>
    s.network.connections > 0;

export const selectBackendUrl = (s: RootState) => s.network.backendUrl;

export const selectBackendPathPrefix = (s: RootState) =>
    s.network.pathPrefix;

export const selectBackendLocation = createSelector(
    [selectBackendUrl, selectBackendPathPrefix],
    (backendUrl, backendPathPrefix) => `${backendUrl}${backendPathPrefix}`,
);

export const selectRefreshTick = (s: RootState) => s.network.refreshTick;
