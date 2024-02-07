/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { MBTileCoords } from "~common/mbtiles/type";





/**
 * Flip tile Y coordinate (convert from ZXY to TMS-ZXY and vice-versa).
 *
 * @see https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md#content-1
 * @see https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#TileMap_Diagram
 */
export const zxytms = <T extends MBTileCoords>(t: T): T => ({
    ...t,
    y: 2**t.z - 1 - t.y,
});
