/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */




/**
 * Key-val-like type for mbtile metadata.
 */
export type MBTileMeta = {
    name: string;
    value: string;
};




/**
 * Tile - coordinates.
 */
export type MBTileCoords = {
    z: number;
    x: number;
    y: number;
};




/**
 * Tile - coordinates and data.
 */
export type MBTile =
    & MBTileCoords
    & { data: Buffer };
