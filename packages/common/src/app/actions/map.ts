/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { MapStyleSource } from "~common/map/types";




/**
 * Action response type - list of tile source names.
 */
export type TileSourcesResponseOk = {
    sources: { name: string; format: string; type: string }[];
};




/**
 * Action response type - list of map style source names.
 */
export type MapStyleSourcesResponseOk = {
    sources: MapStyleSource[];
};
