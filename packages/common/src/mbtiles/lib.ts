/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import BetterSqlite3, { type Database } from "better-sqlite3";

import type { FreeFormRecord } from "~common/lib/type";
import { getExtFilenames } from "~common/lib/fs";
import { recordKeys, recordValues } from "~common/lib/struct";
import type { MBTile, MBTileCoords, MBTileMeta } from "~common/mbtiles/type";
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
): ((meta: MBTileMeta) => MBTileMeta) => {
    const inserter = db.prepare<MBTileMeta>(`
        INSERT INTO metadata (name, value)
        VALUES ($name, $value)
        RETURNING *;
    `);
    return (meta) => inserter.get(meta) as MBTileMeta;
};




/**
 * Tile inserter.
 *
 * Accepts tile with coords in ZXY format and converts it to TMS before insert.
 */
export const tileInserter = (
    db: Database,
): ((tile: MBTile) => MBTile) => {
    const inserter = db.prepare<MBTile>(`
        INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data)
        VALUES ($z, $x, $y, $data)
        RETURNING *;
    `);
    return (tile) => inserter.get(zxytms(tile)) as MBTile;
};




/**
 * Tile getter.
 *
 * Accepts ZXY coords.
 */
export const tileGetter = (
    db: Database,
): ((coords: MBTileCoords) => Buffer | undefined) => {
    const getter = db.prepare<MBTileCoords>(`
        SELECT tile_data
        FROM tiles
        WHERE zoom_level = $z AND tile_column = $x AND tile_row = $y;
    `);
    return (coords) => getter.get(zxytms(coords)) as Buffer | undefined;
};




/**
 * Get all mbtiles filenames from given directory.
 */
export const getMbtilesFilenames = async (
    path: string,
): Promise<string[]> => getExtFilenames(path, ".mbtiles");




/**
 * Maintain a set of sqlite databases (mbtile sources) inside `path` directory.
 */
export const tileSourcesManager = async (path: string): Promise<{
    refresh: () => Promise<void>;
    getNames: () => string[];
    get: (name: string) => Database;
    getTile: (name: string, coords: MBTileCoords) => Buffer;
    close: () => void;
}> => {
    let names: FreeFormRecord<string> = {};
    let sources: FreeFormRecord<Database> = {};
    let tileGetters: FreeFormRecord<ReturnType<typeof tileGetter>> = {};

    // refresh map of [source name -> source path]
    const refresh = async () => {
        names = (await getMbtilesFilenames(path)).reduce((acc, name) => ({
            ...acc, [name.replace(/\.mbtiles$/, "")]: join(path, name),
        }), {});
    };

    // get list of source names (found mbtiles files with no file extension)
    const getNames = () => recordKeys(names);

    // get sqlite source (memorize on first access, throw if no such source)
    const get = (name: string) => {
        let db = sources[name];
        if (typeof db === "undefined") {
            const dbPath = names[name];
            if (typeof dbPath === "undefined") {
                throw new Error("wrong tilesource name");
            }
            db = new BetterSqlite3(dbPath);
            sources[name] = db;
            return db;
        }
        return db;
    };

    // get tile from source (throw if no source, empty buffer if no tile)
    const getTile = (name: string, coords: MBTileCoords) => {
        let getTileFromSource = tileGetters[name];
        if (typeof getTileFromSource === "undefined") {
            const source = get(name);
            getTileFromSource = tileGetter(source);
            tileGetters[name] = getTileFromSource;
        }
        const tile = getTileFromSource(coords);
        if (typeof tile === "undefined") return Buffer.from([]);
        return tile;
    };

    // close all opened sources
    const close = () => {
        recordValues(sources).forEach((db) => { if (db.open) db.close(); });
        sources = {};
        tileGetters = {};
    };

    // refresh source name -> path mapping
    await refresh();

    // tile source api
    return {
        refresh,
        getNames,
        get,
        getTile,
        close,
    };
};
