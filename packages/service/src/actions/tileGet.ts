/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { extname } from "node:path";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import { HttpMessage } from "~common/framework/http";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";
import { browserRequestHeaders, collectData, httpGet } from "~common/lib/http";
import { tileInserter } from "~common/mbtiles/lib";




/**
 * Try fetching remote tile and store it in corresponding tile proxy.
 */
const handleTileProxy = async (
    format: string | undefined,
    name: string,
    x: number, y: number, z: number,
    setData: (data: Buffer) => void,
    setErrorStatus: (status: number) => void,
) => {

    const { model } = useMemory();

    const proxyUrl = model.mbtile.getMeta(name, "x-proxied-url");

    // if current tileset is not a proxy
    if (!isString(proxyUrl)) {
        // respond with 404 for raster proxies
        if (format !== "pbf") {
            setErrorStatus(404);
            throw new Error(HttpMessage.C404);
        }
        // do nothing for vector proxies (zero-length output is a valid one)
        return;
    }

    // try fetching tile from remote resource
    const {
        request: tileRequest,
        response: tileResponse,
    } = await httpGet(
        proxyUrl
            .replaceAll("{x}", String(x))
            .replaceAll("{y}", String(y))
            .replaceAll("{z}", String(z)),
        // pretend firefox
        { headers: browserRequestHeaders() },
    );

    // check response code
    if (tileResponse.statusCode !== 200) {
        tileRequest.destroy();
        // respond with 404 for raster proxies
        if (format !== "pbf") {
            setErrorStatus(404);
            throw new Error(HttpMessage.C404);
        }
        // do nothing for vector proxies (zero-length output is a valid one)
        return;
    }

    // fetch tile data
    const data = await collectData(tileResponse);
    setData(data);

    // check length
    if (data.length === 0 && format !== "pbf") {
        setErrorStatus(404);
        throw new Error(HttpMessage.C404);
    }

    // insert tile into db
    tileInserter(model.mbtile.getSource(name))({ z, x, y, data });

};




/**
 * Get one tile by source name and z-x-y coordinates.
 */
export const tileGet: RequestHandler<
    ParamsDictionary,
    Buffer | ResponseErr
> = async (req, res, next) => {

    const { model } = useMemory();

    const
        { name, z: inZ, x: inX, y: inY } = req.params,
        z = Number(inZ),
        x = Number(inX),
        y = Number(inY);

    let errorStatus = 404;

    try {

        // check param value types
        if (
            !isString(name) ||
            !isNumber(z) || !isNumber(x) || !isNumber(y)
        ) {
            errorStatus = 400;
            throw new Error(HttpMessage.C400);
        }

        // try fetching tile from appropriate tilesource
        let data = model.mbtile.get(name, { z, x, y });

        // obtain data format
        const format = model.mbtile.getMeta(name, "format");

        // check requested extension
        if (extname(req.originalUrl) !== `.${format}`) {
            errorStatus = 400;
            throw new Error(HttpMessage.C400);
        }

        // no data - try special case: proxy
        if (data.length === 0) await handleTileProxy(
            format, name, x, y, z,
            (d) => { data = d; },
            (s) => { errorStatus = s; },
        );

        // try guessing if data is gzipped
        const isCompressed =
            data.length >= 2 &&
            data[0] === 0x1f && data[1] === 0x8b;

        // all ok
        res
            .header({
                "content-type":
                    format === "pbf"
                        ? "application/x-protobuf"
                        : format === "webp"
                            ? "image/webp"
                            : format === "jpg" || format === "jpeg"
                                ? "image/jpeg"
                                : "image/png",
                "cache-control": `public, max-age=${TILE_VALIDITY_PERIOD}`,
                "expires": (
                    new Date(Date.now() + TILE_VALIDITY_PERIOD)
                ).toUTCString(),
                ...(
                    isCompressed
                        ? { "content-encoding": "gzip" }
                        : {}
                ),
            })
            .status(200)
            .send(data);

    } catch (e) {

        if (e instanceof Error) {
            res.status(errorStatus).send({ error: e.message });
        } else {
            res.status(500).send({ error: String(e) });
            return next(e);
        }

    }

    return next();

};
