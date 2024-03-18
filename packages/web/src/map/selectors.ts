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




export const selectMapReady = (s: RootState) => s.map.ready;

export const selectMapStyleSources = (s: RootState) => s.map.mapStyleSources;

export const selectMapStyleSourceIndex = (s: RootState) =>
    s.map.mapStyleSourceIndex;

export const selectMaxMapStyleSourceIndex = createSelector(
    [selectMapStyleSources],
    (mapStyleSources) => mapStyleSources.length - 1,
);

export const selectRawMapStyleSource = createSelector(
    [selectMapStyleSources, selectMapStyleSourceIndex],
    (mapStyleSources, mapStyleSourceIndex) =>
        mapStyleSources[mapStyleSourceIndex],
);

export const selectMapStyleSource = createSelector(
    [selectRawMapStyleSource, selectBackendLocation],
    (rawMapStyleSource, backendLocation) =>
        rawMapStyleSource.url.startsWith("http")
            ? rawMapStyleSource
            : {
                ...rawMapStyleSource,
                url: `${backendLocation}${rawMapStyleSource.url}`,
            },
);

export const selectViewport = (s: RootState) => s.map.viewport;

export const selectDimensions = (s: RootState) => s.map.dimensions;

export const selectTrackLayersVisibility = (s: RootState) =>
    s.map.trackLayersVisibility;

export const selectTerrainEnabled = (s: RootState) => s.map.terrainEnabled;

export const selectSelection = (s: RootState) => s.map.selection;
