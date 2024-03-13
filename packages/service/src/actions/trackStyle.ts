/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import { lex } from "~common/lib/sort";
import type { ComplexRecord } from "~common/lib/struct";
import { substitute } from "~common/framework/routing";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";
import { apiV1 } from "~service/setup/env";
import { ACTION } from "~common/app/api";




/**
 * ...
 */
const trackLayoutStyle = {
    "line-cap": "round",
    "line-join": "round",
    "visibility": "visible",
};




/**
 * ...
 */
const trackPaintStyle = {
    "line-blur": 2,
    "line-width": [
        "interpolate", ["linear"], ["zoom"],
        6, 6,
        9, 5,
    ],
};




/**
 * ...
 */
const layers = [
    {
        "id": "running",
        "type": "line",
        "source": "tracks",
        "source-layer": "track",
        "filter": [
            "any",
            ["==", ["get", "sport"], "running"],
            ["==", ["get", "sport"], "trail_running"],
        ],
        "layout": trackLayoutStyle,
        "paint": {
            "line-color": "#D38E00AA",
            ...trackPaintStyle,
        },
        "interactive": true,
    },
    {
        "id": "walking",
        "type": "line",
        "source": "tracks",
        "source-layer": "track",
        "filter": [
            "any",
            ["==", ["get", "sport"], "walking"],
            ["==", ["get", "sport"], "casual_walking"],
            ["==", ["get", "sport"], "speed_walking"],
        ],
        "layout": trackLayoutStyle,
        "paint": {
            "line-color": "#BE4400AA",
            ...trackPaintStyle,
        },
        "interactive": true,
    },
    {
        "id": "hiking",
        "type": "line",
        "source": "tracks",
        "source-layer": "track",
        "filter": [
            "any",
            ["==", ["get", "sport"], "hiking"],
            ["==", ["get", "sport"], "rock_climbing"],
        ],
        "layout": trackLayoutStyle,
        "paint": {
            "line-color": "#BE005BAA",
            ...trackPaintStyle,
        },
        "interactive": true,
    },
];




/**
 * Get map style. Only tracks.
 */
export const trackStyle: RequestHandler<
    ParamsDictionary,
    ComplexRecord | ResponseErr
> = async (req, res, next) => {

    const { model, vars } = useMemory();

    let errorStatus = 404;

    try {

        // guess self origin
        // (read from vars - production/behind reverse proxy,
        // or guess from headers)
        const selfOrigin =
            isString(vars.serviceOriginUrl)
                ? vars.serviceOriginUrl
                : `${req.protocol}://${req.headers.host}${apiV1}`;

        // all available tile source names
        const tileSourceNames = model.mbtile.getSourceNames();

        // fresh track-tile source (newest one)
        const trackTileSourceName: string | undefined =
            tileSourceNames
                .filter((n) => /^otrails-.*/.test(n))
                .sort(lex)
                .toReversed()[0];

        // check if required tile source is present
        if (!isString(trackTileSourceName)) {
            errorStatus = 400;
            throw new Error("not enough tile sources present");
        }

        // tile sources (dynamic)
        const sources = {
            tracks: {
                url: [
                    selfOrigin,
                    substitute(
                        ACTION.tileJson,
                        { name: trackTileSourceName },
                    ),
                ].join(""),
                type: "vector",
            },
        };

        // map style - root
        const style = {
            version: 8,
            name: "Otrails tracks",
            bearing: 0,
            center: [49.9055, 13.5086],
            pitch: 0,
            zoom: 5,
            sources,
            layers,
        };

        // all ok
        res
            .header({
                "cache-control": `public, max-age=${TILE_VALIDITY_PERIOD}`,
                "expires": (
                    new Date(Date.now() + TILE_VALIDITY_PERIOD)
                ).toUTCString(),
            })
            .status(200)
            .send(style);

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
