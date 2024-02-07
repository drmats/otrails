/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { Database } from "better-sqlite3";

import type { MBTile, MBTileMeta } from "~common/mbtiles/type";
import { zxytms } from "~common/mbtiles/math";




/**
 * MBTiles schema.
 *
 * @see https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md#metadata
 * @see https://github.com/mapbox/mbtiles-spec/blob/master/1.3/spec.md#tiles
 */
export const ensureSchema = (db: Database): Database => db.exec(`
    CREATE TABLE IF NOT EXISTS metadata (
        name        TEXT NOT NULL,
        value       TEXT NOT NULL,
        PRIMARY KEY (name)
    );

    CREATE TABLE IF NOT EXISTS tiles (
        zoom_level  INTEGER NOT NULL,
        tile_column INTEGER NOT NULL,
        tile_row    INTEGER NOT NULL,
        tile_data   BLOB,
        PRIMARY KEY (zoom_level, tile_column, tile_row)
    );
`);




/**
 * Metadata inserter.
 */
export const metaInserter = (
    db: Database,
): ((meta: MBTileMeta) => MBTileMeta) =>
    (meta) => db.prepare<MBTileMeta>(`
        INSERT INTO metadata (name, value)
        VALUES ($name, $value)
        RETURNING *;
    `).get(meta) as MBTileMeta;




/**
 * Tile inserter.
 *
 * Accepts tile with coords in ZXY format and converts it to TMS before insert.
 */
export const tileInserter = (
    db: Database,
): ((tile: MBTile) => MBTile) =>
    (tile) => db.prepare<MBTile>(`
        INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data)
        VALUES ($z, $x, $y, $data)
        RETURNING *;
    `).get(zxytms(tile)) as MBTile;
