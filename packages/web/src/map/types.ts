/**
 * MapGL-related types.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { PlainRecord } from "~common/lib/struct";




/**
 * Map viewport state.
 */
export type MapViewport = {
    bearing: number;
    latitude: number;
    longitude: number;
    pitch: number;
    zoom: number;
};




/**
 * Map dimensions.
 */
export type MapDimensions = {
    width: number;
    height: number;
};




/**
 * Active map selection.
 */
export type MapSelection = {
    point: [number, number];
    lngLat: [number, number];
    features: {
        id?: number | string;
        properties: PlainRecord;
    }[];
    timestamp: number;
};
