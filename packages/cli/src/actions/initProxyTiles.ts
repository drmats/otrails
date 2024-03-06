/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import BetterSqlite3 from "better-sqlite3";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/memory";
import { info, oknl } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { setPragmas } from "~common/sqlite/lib";
import { ensureSchema, metaInserter, tileInserter } from "~common/mbtiles/lib";
import { browserRequestHeaders, collectData, httpGet } from "~common/lib/http";




// max proxy tile zoom level
const MAX_ZOOM = 22;




/**
 * Prepare proxy mbtile.
 */
export const initProxyTiles: CliAction<{
    name?: string;
    url?: string;
}> = async ({ name, url }) => {

    const { pgp, vars } = useMemory();

    // extract process configuration variables
    const { tilesDir } = vars;

    try {

        // check variables validity
        if (!isString(tilesDir)) {
            throw new Error("Missing or malformed [tilesDir] variable.");
        }

        // check arguments existence
        if (!isString(name) || !isString(url)) {
            throw new Error("Provide [name] and [url].");
        }

        // check url validity
        if (
            !url.includes("{x}") ||
            !url.includes("{y}") ||
            !url.includes("{z}")
        ) {
            throw new Error("Wrong [url] format.");
        }

        // try fetching tile [0, 0, 0]
        const {
            request: firstTileRequest,
            response: firstTileResponse,
        } = await httpGet(
            url
                .replaceAll("{x}", "0")
                .replaceAll("{y}", "0")
                .replaceAll("{z}", "0"),
            {
                // pretend firefox
                headers: browserRequestHeaders(),
            },
        );

        // check response code
        if (firstTileResponse.statusCode !== 200) {
            firstTileRequest.destroy();
            throw new Error("Given [url] doesn't seem to return correct responses.");
        }

        // check response content type
        let format = "unknown";
        if (firstTileResponse.headers["content-type"] === "image/jpeg") {
            format = "jpg";
        } else if (firstTileResponse.headers["content-type"] === "image/webp") {
            format = "webp";
        } else if (firstTileResponse.headers["content-type"] === "image/png") {
            format = "png";
        } else {
            firstTileRequest.destroy();
            throw new Error("Unsupported tile format");
        }

        // fetch tile [0, 0, 0] data
        const firstTileData = await collectData(firstTileResponse);

        // mbtiles destination file name
        const target = join(
            tilesDir,
            `${name}.mbtiles`,
        );

        // mbtiles destination database
        const filedb = new BetterSqlite3(target);

        try {

            // sqlite pragmas
            setPragmas(filedb);

            // mbtiles schema
            ensureSchema(filedb);
            const insertMeta = metaInserter(filedb);
            insertMeta({ name: "name", value: name });
            insertMeta({ name: "description", value: `proxied ${name}` });
            insertMeta({ name: "version", value: "1" });
            insertMeta({ name: "type", value: "basemap" });
            insertMeta({ name: "bounds", value: "-180.0,-85.0,180.0,85.0" });
            insertMeta({ name: "center", value: "50.6707772,16.2072538,14" });
            insertMeta({ name: "minzoom", value: "0" });
            insertMeta({ name: "maxzoom", value: String(MAX_ZOOM) });
            insertMeta({ name: "generator", value: "otrails-cli" });
            insertMeta({ name: "format", value: format });
            insertMeta({ name: "scheme", value: "tms" });
            insertMeta({ name: "tileSize", value: "256" });
            insertMeta({ name: "x-proxied-url", value: url });

            // insert first tile
            tileInserter(filedb)({ z: 0, x: 0, y: 0, data: firstTileData });

            // all done
            info(`${name}.mbtiles (${format}) initialized `);
            oknl("OK");

        } finally {
            filedb.close();
        }

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
