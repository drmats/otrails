/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import zlib from "node:zlib";
import { promisify } from "node:util";
import BetterSqlite3 from "better-sqlite3";
import { PromisePoolResult, map, promisePool } from "@xcmats/js-toolbox/async";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import {
    createAutoSpinner,
    info,
    infonl,
    oknl,
    progress,
    shoutnl,
} from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { setPragmas } from "~common/sqlite/lib";
import type { MBTile, MBTileCoords } from "~common/mbtiles/type";
import { ensureSchema, metaInserter, tileInserter } from "~common/mbtiles/lib";
import { isoNow } from "~common/lib/time";

import mvtEnvelopesGetQuery from "~common/app/queries/mvtEnvelopes.get.sql";
import mvtGetQuery from "~common/app/queries/mvt.get.sql";




// max tile zoom level
const MAX_ZOOM = 16;




// success type
type TileOk = { tile: MBTile };

// failure type
type TileErr = { coords: MBTileCoords; error: unknown };

// promise pool size (request parallelization)
const DEFAULT_POOL_SIZE = 32;




/**
 * Bake mbtiles.
 */
export const bakeTiles: CliAction = async () => {

    const { db, pgp, sql, vars } = useMemory();

    // extract process configuration variables
    const { tilesDir } = vars;

    try {

        // check variables validity
        if (!isString(tilesDir)) {
            throw new Error("Missing or malformed [tilesDir] variable.");
        }

        // mbtiles destination file name
        const target = join(
            tilesDir,
            `otrails-${isoNow().replace(/[-:.]/g, "").slice(0, 15)}.mbtiles`,
        );

        // mbtiles destination database
        const filedb = new BetterSqlite3(target);

        try {

            // sqlite pragmas
            setPragmas(filedb);

            // mbtiles schema
            ensureSchema(filedb);
            const insertMeta = metaInserter(filedb);
            insertMeta({ name: "name", value: "otrails-hiketiles" });
            insertMeta({ name: "description", value: "https://wchmurach.com.pl/" });
            insertMeta({ name: "version", value: "1" });
            insertMeta({ name: "type", value: "overlay" });
            insertMeta({ name: "bounds", value: "-180.0,-85.0,180.0,85.0" });
            insertMeta({ name: "center", value: "50.6707772,16.2072538,14" });
            insertMeta({ name: "minzoom", value: "0" });
            insertMeta({ name: "maxzoom", value: String(MAX_ZOOM) });
            insertMeta({ name: "generator", value: "otrails-cli" });
            insertMeta({ name: "format", value: "pbf" });
            insertMeta({ name: "scheme", value: "tms" });
            insertMeta({
                name: "json",
                value: JSON.stringify({
                    vector_layers: [
                        {
                            "minzoom": 0,
                            "maxzoom": MAX_ZOOM,
                            "fields": {
                                "track_id": "Number",
                                "user_short_id": "String",
                                "begin_timestamp": "String",
                            },
                            "id": "track",
                            "description": "Recorded hike.",
                        },
                    ],
                }),
            });

            // promisified gzip
            const gzip = promisify(zlib.gzip);

            // mbtiles tile insert routine
            const insertTile = tileInserter(filedb);

            // rendered tile result handler
            const handleTileResult = async (
                result: PromisePoolResult<TileOk, TileErr>,
            ): Promise<void> => {

                // ignore empty results and rejections
                if (result.status !== "fulfilled") return;

                // insert tile into mbtiles destination database
                insertTile(result.value.tile);

            };

            // execution pool
            const pool = promisePool<TileOk, TileErr>(DEFAULT_POOL_SIZE);

            // process tiles by zoom level (top-down)
            for (let z = 0; z <= MAX_ZOOM; z += 1) {

                // get list of tile coordinates per zoom level
                const coords = await db.many<{ x: number; y: number }>(
                    sql(mvtEnvelopesGetQuery), { z },
                );

                // schedule rendering of tile for each coordinate
                info(`number of z:${z} tiles: `); shoutnl(coords.length);
                await map(coords) (async ({ x, y }, i) => {

                    // progress-bar
                    progress(i + 1, coords.length, `x:${x} y:${y}`);

                    // spawn postgis tile-reneding request
                    const tileResult = await pool.exec(async () => {
                        // spawn request
                        const tile = await db.many<{ layer: Buffer }>(
                            sql(mvtGetQuery), { z, x, y },
                        );

                        // merge layers and compress
                        const data = await gzip(
                            Buffer.concat(tile.map(({ layer }) => layer)),
                        );

                        // return tile
                        return { tile: { z, x, y, data } };
                    });

                    // process result
                    await handleTileResult(tileResult);

                });

                infonl();

            }

            // await for all tiles still "in flight"
            info("closing pool... "); const spinner = createAutoSpinner();
            await map(await pool.finish()) (handleTileResult);

            // all tiles (for all zoom levels) processed ok
            spinner.dispose(); infonl(); oknl("DONE");

        } finally {
            filedb.close();
        }

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
