/**
 * MapGL-related types.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { ThemeVariant } from "~common/framework/theme";




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
 * Map style source.
 */
export type TileSource = {
    label: string;
    url: string;
    themeVariant: ThemeVariant;
};
