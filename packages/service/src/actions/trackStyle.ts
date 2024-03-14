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
import { deepMerge, type ComplexRecord } from "~common/lib/struct";
import { hfid } from "~common/lib/ids";
import { substitute } from "~common/framework/routing";
import { useMemory } from "~service/logic/memory";
import { TILE_VALIDITY_PERIOD } from "~service/logic/configuration";
import { apiV1 } from "~service/setup/env";
import { ACTION } from "~common/app/api";




/**
 * ...
 */
const layerBase = () => ({
    "id": hfid(),
    "type": "line",
    "source": "tracks",
    "source-layer": "track",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible",
    },
    "paint": {
        "line-blur": [
            "interpolate", ["linear"], ["zoom"],
            8, 2,
            11, 2,
            16, 0,
        ],
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            6, 3,
            9, 5,
        ],
    },
    "interactive": true,
});




/**
 * ...
 */
const propFilter = (
    op: "any" | "all",
    prop: string,
    vals: (number | string)[],
) => [
    op,
    ...vals.map((v) => ["==", ["get", prop], v]),
];




/**
 * ...
 */
const layers = [

    // bikes
    deepMerge(layerBase(), {
        "id": "biking",
        "filter": propFilter(
            "any", "activity_type",
            ["cycling", "road_biking", "gravel_cycling", "mountain_biking"],
        ),
        "paint": { "line-color": "#0EAB00EE" },
    }, { allowGrowth: true }),

    // flights
    deepMerge(layerBase(), {
        "id": "flying",
        "filter": propFilter(
            "any", "activity_type",
            ["paragliding", "tandem_paragliding"],
        ),
        "paint": { "line-color": "#00AECAEE" },
    }, { allowGrowth: true }),

    // runs
    deepMerge(layerBase(), {
        "id": "running",
        "filter": propFilter(
            "any", "activity_type",
            ["running", "trail_running"],
        ),
        "paint": { "line-color": "#DEB100EE" },
    }, { allowGrowth: true }),

    // walks
    deepMerge(layerBase(), {
        "id": "walking",
        "filter": propFilter(
            "any", "activity_type",
            ["walking", "casual_walking", "speed_walking"],
        ),
        "paint": { "line-color": "#D85E00EE" },
    }, { allowGrowth: true }),

    // hikes
    deepMerge(layerBase(), {
        "id": "hiking",
        "filter": propFilter(
            "any", "activity_type",
            ["hiking", "rock_climbing"],
        ),
        "paint": { "line-color": "#B90025EE" },
    }, { allowGrowth: true }),

    // water sports
    deepMerge(layerBase(), {
        "id": "watering",
        "filter": propFilter(
            "any", "activity_type",
            [
                "kayaking_v2", "open_water_swimming", "rowing_v2",
                "sailing_v2", "whitewater_rafting_kayaking",
            ],
        ),
        "paint": { "line-color": "#002795EE" },
    }, { allowGrowth: true }),

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
