/**
 * Map selectors.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createSelector } from "reselect";

import type { RootState } from "~web/store/types";
import { selectBackendLocation } from "~web/network/selectors";




export const selectDimensions = (s: RootState) => s.map.dimensions;

export const selectReady = (s: RootState) => s.map.ready;

export const selectRawTilesource = (s: RootState) => s.map.tilesource;

export const selectTilesource = createSelector(
    [selectRawTilesource, selectBackendLocation],
    (rawTilesource, backendLocation) =>
        rawTilesource.url.startsWith("http")
            ? rawTilesource
            : {
                ...rawTilesource,
                url: `${backendLocation}${rawTilesource.url}`,
            },
);

export const selectViewport = (s: RootState) => s.map.viewport;
