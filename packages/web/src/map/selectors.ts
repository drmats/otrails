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

export const selectMapReady = (s: RootState) => s.map.ready;

export const selectTileSources = (s: RootState) => s.map.tileSources;

export const selectTileSourceIndex = (s: RootState) => s.map.tileSourceIndex;

export const selectRawTileSource = createSelector(
    [selectTileSources, selectTileSourceIndex],
    (tileSources, tileSourceIndex) => tileSources[tileSourceIndex],
);

export const selectTileSource = createSelector(
    [selectRawTileSource, selectBackendLocation],
    (rawTileSource, backendLocation) =>
        rawTileSource.url.startsWith("http")
            ? rawTileSource
            : {
                ...rawTileSource,
                url: `${backendLocation}${rawTileSource.url}`,
            },
);

export const selectViewport = (s: RootState) => s.map.viewport;
