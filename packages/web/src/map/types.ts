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
export interface MapViewport {
    bearing: number;
    latitude: number;
    longitude: number;
    pitch: number;
    zoom: number;
}




/**
 * Map dimensions.
 */
export interface MapDimensions {
    width: number;
    height: number;
}




/**
 * Map style source.
 */
export interface TileSource {
    label: string;
    url: string;
    themeVariant: ThemeVariant;
}
