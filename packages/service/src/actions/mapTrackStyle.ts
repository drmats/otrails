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
import { TRACK_COLOR, LAYER_FILTER } from "~common/app/models/track";




/**
 * Base layer style for track start points.
 */
const startLayerBase = () => ({
    "id": hfid(),
    "type": "circle",
    "source": "otrails-data",
    "source-layer": "otrails-track-start",
    "layout": {
        "visibility": "visible",
    },
    "paint": {
        "circle-radius": 5,
        "circle-color": "#EEEEEEDD",
        "circle-stroke-color": "#222222DD",
        "circle-stroke-width": 2,
        "circle-blur": 0.25,
    },
    "interactive": false,
});




/**
 * Base layer style for track bottoms.
 */
const trackLayerBottomBase = () => ({
    "id": hfid(),
    "type": "line",
    "source": "otrails-data",
    "source-layer": "otrails-track",
    "layout": {
        "line-cap": "round",
        "line-join": "round",
        "visibility": "visible",
    },
    "paint": {
        "line-blur": [
            "interpolate", ["linear"], ["zoom"],
            8, 3,
            11, 2,
            16, 0,
        ],
        "line-width": [
            "interpolate", ["linear"], ["zoom"],
            4, 0,
            8, 6,
            10, 6,
        ],
    },
    "interactive": false,
});




/**
 * Base layer style for track tops.
 */
const trackLayerTopBase = () => deepMerge(
    trackLayerBottomBase(), {
        "paint": {
            "line-blur": 0,
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                4, 0,
                7, 1,
                10, 2,
            ],
        },
        "interactive": true,
    },
);




/**
 * ...
 */
const layers = [

    // start points for all tracks
    deepMerge(startLayerBase(), { id: "otr-track-starts" }),

    // flights
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-flying",
        "filter": LAYER_FILTER.flight(),
        "paint": { "line-color": TRACK_COLOR.flying[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-flying-top",
        "filter": LAYER_FILTER.flight(),
        "paint": { "line-color": TRACK_COLOR.flying[1] },
    }, { allowGrowth: true }),

    // bikes
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-biking",
        "filter": LAYER_FILTER.bike(),
        "paint": { "line-color": TRACK_COLOR.biking[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-biking-top",
        "filter": LAYER_FILTER.bike(),
        "paint": { "line-color": TRACK_COLOR.biking[1] },
    }, { allowGrowth: true }),

    // runs
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-running",
        "filter": LAYER_FILTER.run(),
        "paint": { "line-color": TRACK_COLOR.running[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-running-top",
        "filter": LAYER_FILTER.run(),
        "paint": { "line-color": TRACK_COLOR.running[1] },
    }, { allowGrowth: true }),

    // walks
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-walking",
        "filter": LAYER_FILTER.walk(),
        "paint": { "line-color": TRACK_COLOR.walking[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-walking-top",
        "filter": LAYER_FILTER.walk(),
        "paint": { "line-color": TRACK_COLOR.walking[1] },
    }, { allowGrowth: true }),

    // hikes
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-hiking",
        "filter": LAYER_FILTER.hike(),
        "paint": { "line-color": TRACK_COLOR.hiking[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-hiking-top",
        "filter": LAYER_FILTER.hike(),
        "paint": { "line-color": TRACK_COLOR.hiking[1] },
    }, { allowGrowth: true }),

    // water sports
    deepMerge(trackLayerBottomBase(), {
        "id": "otr-watering",
        "filter": LAYER_FILTER.water(),
        "paint": { "line-color": TRACK_COLOR.watering[0] },
    }, { allowGrowth: true }),
    deepMerge(trackLayerTopBase(), {
        "id": "otr-watering-top",
        "filter": LAYER_FILTER.water(),
        "paint": { "line-color": TRACK_COLOR.watering[1] },
    }, { allowGrowth: true }),

];




/**
 * Get map style. Only tracks.
 */
export const mapTrackStyle: RequestHandler<
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
            "otrails-data": {
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
