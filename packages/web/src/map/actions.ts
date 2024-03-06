/**
 * Map action types and creators.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";

import type { MapDimensions, MapViewport } from "~web/map/types";




/**
 * Map component action types.
 */
export enum MapActionType {

    RESET = "Map/RESET",
    SET_READY = "Map/SET_READY",
    SET_TILESOURCE_INDEX = "Map/SET_TILESOURCE_INDEX",
    SET_VIEWPORT = "Map/SET_VIEWPORT",
    SET_DIMENSIONS = "Map/SET_DIMENSIONS",

}




/**
 * Map component action creators.
 */
export default actionCreators(MapActionType, {

    SET_READY: (ready: boolean) => ({ ready }),
    SET_TILESOURCE_INDEX: (tileSourceIndex: number) => ({ tileSourceIndex }),
    SET_VIEWPORT: (viewport: Partial<MapViewport>) => ({ viewport }),
    SET_DIMENSIONS: (dimensions: Partial<MapDimensions>) => ({ dimensions }),

});
