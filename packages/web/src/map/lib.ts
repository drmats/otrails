/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { StyleSpecification } from "maplibre-gl";
import throttle from "lodash.throttle";

import type { MapViewport } from "~web/map/types";
import { SPA_HASH_UPDATE_TRESHOLD } from "~web/router/constants";
import { format } from "~common/lib/string";




/**
 * Overlay one map style over another.
 */
export const mergeMapStyles = (
    base: StyleSpecification,
    overlay: StyleSpecification,
): StyleSpecification => ({
    ...base,
    name: "Otrails overlay",
    bearing: 0,
    center: [49.9055, 13.5086],
    pitch: 0,
    zoom: 5,
    sources: {
        ...base.sources,
        ...overlay.sources,
    },
    layers: [
        ...base.layers,
        ...overlay.layers,
    ],
});




/**
 * MapViewport -> "lat,lon,zoom" conversion
 */
export const mapViewportToString = (
    v: MapViewport,
    opts?: { sep?: string; latLonPrecision: number; zoomPrecision: number },
): string => {
    const s = opts?.sep ?? ",";
    const p = opts?.latLonPrecision ?? 6;
    const z = opts?.zoomPrecision ?? 2;
    return `${
        format(v.latitude, p)
    }${s}${
        format(v.longitude, p)
    }${s}${
        format(v.zoom, z)
    }`;
};




/**
 * "lat,lon,zoom" -> [lat, lon, zoom] conversion.
 * @throws Error if conversion is not possible
 */
export const stringToCoords = (
    input: string,
    opts?: { sep?: string },
): [number, number, number] => {
    const s = opts?.sep ?? ",";
    const candidate = input.split(s).map(Number);
    if (candidate.length === 3 && candidate.every(c => !Number.isNaN(c))) {
        return candidate as [number, number, number];
    } else {
        throw new Error("hashStringToCoords(): conversion is not possible");
    }
};




/**
 * Array of coordinates [lat, lon, zoom] to MapViewport conversion.
 */
export const coordsToMapViewport = (
    coords: [number, number, number],
): Partial<MapViewport> => ({
    latitude: coords[0],
    longitude: coords[1],
    zoom: coords[2],
});




/**
 * Throtled state update (viewport hash).
 */
export const throttledViewportHashUpdate = throttle(
    (rsh: (h: string) => void, v: MapViewport) => rsh(mapViewportToString(v)),
    SPA_HASH_UPDATE_TRESHOLD,
);




/**
 * Throtled state update (base map index).
 */
export const throttledTileSourceIndexHashUpdate = throttle(
    (rsh: (h: string) => void, v: number) => rsh(String(v)),
    SPA_HASH_UPDATE_TRESHOLD,
);
