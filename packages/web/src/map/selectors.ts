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
import { tileSources } from "~web/map/constants";




export const selectDimensions = (s: RootState) => s.map.dimensions;

export const selectMapReady = (s: RootState) => s.map.ready;

export const selectTileSourceIndex = (s: RootState) => s.map.tileSourceIndex;

export const selectTileSource = createSelector(
    [selectTileSourceIndex, selectBackendLocation],
    (tileSourceIndex, backendLocation) => {
        const rawTileSource = tileSources[tileSourceIndex];
        return rawTileSource.url.startsWith("http")
            ? rawTileSource
            : {
                ...rawTileSource,
                url: `${backendLocation}${rawTileSource.url}`,
            };
    },
);

export const selectViewport = (s: RootState) => s.map.viewport;
