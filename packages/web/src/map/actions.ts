/**
 * Map action types and creators.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";
import { TRACK_LAYER_FILTER } from "~common/app/models/track";

import type { MapStyleSource } from "~common/map/types";
import type {
    MapDimensions,
    MapSelection,
    MapViewport,
} from "~web/map/types";




/**
 * Map component action types.
 */
export enum MapActionType {

    RESET = "Map/RESET",
    SET_READY = "Map/SET_READY",
    SET_DIMENSIONS = "Map/SET_DIMENSIONS",
    SET_MAPSTYLE_SOURCES = "Map/SET_MAPSTYLE_SOURCES",
    SET_MAPSTYLE_SOURCE_INDEX = "Map/SET_MAPSTYLE_SOURCE_INDEX",
    SET_VIEWPORT = "Map/SET_VIEWPORT",
    SET_TRACK_LAYERS_VISIBILITY = "Map/SET_TRACK_LAYERS_VISIBILITY",
    SET_TERRAIN_ENABLED = "Map/SET_TERRAIN_ENABLED",
    SET_SELECTION = "Map/SET_SELECTION",

}




/**
 * Map component action creators.
 */
export default actionCreators(MapActionType, {

    SET_READY: (ready: boolean) => ({ ready }),

    SET_DIMENSIONS: (dimensions: Partial<MapDimensions>) => ({ dimensions }),

    SET_MAPSTYLE_SOURCES: (
        mapStyleSources: MapStyleSource[],
    ) => ({ mapStyleSources }),

    SET_MAPSTYLE_SOURCE_INDEX: (
        mapStyleSourceIndex: number,
    ) => ({ mapStyleSourceIndex }),

    SET_VIEWPORT: (viewport: Partial<MapViewport>) => ({ viewport }),

    SET_TRACK_LAYERS_VISIBILITY: (
        visibility: Partial<Record<keyof typeof TRACK_LAYER_FILTER, boolean>>,
    ) => ({ visibility }),

    SET_TERRAIN_ENABLED: (flag: boolean) => ({ flag }),

    SET_SELECTION: (selection?: MapSelection) => ({ selection }),

});
