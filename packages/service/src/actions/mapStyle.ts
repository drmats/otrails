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
const layers = [
    {
        "id": "background",
        "type": "background",
        "paint": {
            "background-color": "#ddd",
        },
    },
    {
        "id": "shaded_relief",
        "type": "raster",
        "source": "natural_earth_shaded_relief",
        "layout": { "visibility": "visible" },
        "paint": {
            "raster-opacity": [
                "interpolate", ["exponential", 1], ["zoom"],
                0, 1,
                4, 0.9,
                8, 0.75,
            ],
            "raster-brightness-max": 0.8,
            "raster-contrast": 0.2,
            "raster-saturation": 0.35,
            "raster-hue-rotate": 0,
        },
    },
    {
        "id": "terrain-rgb-terrarium",
        "type": "hillshade",
        "source": "terrarium",
        "minzoom": 0,
        "paint": {
            "hillshade-shadow-color": "#444",
            "hillshade-illumination-direction": 315,
            "hillshade-exaggeration": 0.65,
        },
    },
    {
        "id": "river",
        "type": "line",
        "source": "natural_earth",
        "source-layer": "river",
        "layout": {
            "line-cap": "round",
            "line-join": "round",
        },
        "paint": {
            "line-color": "#5a99b8",
            "line-width": [
                "interpolate", ["exponential", 1.2], ["zoom"],
                8, 1,
                16, 60,
            ],
        },
    },
    {
        "id": "water_shadow",
        "type": "fill",
        "source": "natural_earth",
        "source-layer": "water",
        "layout": {
            "visibility": "visible",
        },
        "paint": {
            "fill-color": "rgba(0, 10, 20, 0.75)",
            "fill-opacity": 1,
            "fill-translate": [
                "interpolate", ["exponential", 1.2], ["zoom"],
                3, ["literal", [0, 0]],
                12, ["literal", [-4, -4]],
            ],
            "fill-translate-anchor": "viewport",
        },
    },
    {
        "id": "water",
        "type": "fill",
        "source": "natural_earth",
        "source-layer": "water",
        "filter": [
            "match",
            ["geometry-type"],
            ["LineString", "Point", "Polygon"],
            true,
            false,
        ],
        "paint": {
            "fill-color": "#00558d",
        },
    },
    {
        "id": "ice",
        "type": "fill",
        "source": "natural_earth",
        "source-layer": "ice",
        "layout": {
            "visibility": "visible",
        },
        "paint": {
            "fill-color": "rgba(230, 240, 250, 0.5)",
        },
    },
    {
        "id": "admin_level_1",
        "type": "line",
        "source": "natural_earth",
        "source-layer": "admin",
        "filter": ["==", ["get", "admin_level"], 1],
        "layout": { "line-join": "round" },
        "paint": {
            "line-color": "rgba(64, 64, 64, 0.5)",
            "line-dasharray": [3, 1, 1, 1],
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                2, 0.5,
                5, 1,
                12, 1.5,
            ],
        },
    },
    {
        "id": "admin_level_0",
        "type": "line",
        "source": "natural_earth",
        "source-layer": "admin",
        "filter": ["==", ["get", "admin_level"], 0],
        "layout": { "line-join": "round", "line-cap": "round" },
        "paint": {
            "line-color": "rgba(64, 64, 64, 0.5)",
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                0, 0.5,
                4, 1.5,
                5, 2,
                12, 3,
            ],
        },
    },
    {
        "id": "track",
        "type": "line",
        "source": "tracks",
        "source-layer": "track",
        "layout": {
            "line-cap": "round",
            "line-join": "round",
            "visibility": "visible",
        },
        "paint": {
            "line-blur": 2,
            "line-color": "#b20",
            "line-width": [
                "interpolate", ["linear"], ["zoom"],
                4, 5,
                8, 2,
                12, 4,
            ],
        },
        "interactive": true,
    },
];




/**
 * Get map style. Otrails dev. Base.
 */
export const mapStyle: RequestHandler<
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

        // check if all required tile sources are present
        if (
            !isString(trackTileSourceName) ||
            !tileSourceNames.includes("natural_earth_2_shaded_relief.raster") ||
            !tileSourceNames.includes("natural_earth.vector")
        ) {
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
            natural_earth_shaded_relief: {
                tiles: [
                    [
                        selfOrigin,
                        substitute(
                            ACTION.tileGetWebp,
                            {
                                name: "natural_earth_2_shaded_relief.raster",
                                x: "{x}", y: "{y}", z: "{z}",
                            },
                        ),
                    ].join(""),
                ],
                type: "raster",
                tileSize: 256,
                maxzoom: 6,
            },
            terrarium: {
                type: "raster-dem",
                tiles: [
                    "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
                ],
                minzoom: 0,
                maxzoom: 15,
                tileSize: 256,
                encoding: "terrarium",
            },
            natural_earth: {
                url: [
                    selfOrigin,
                    substitute(
                        ACTION.tileJson,
                        { name: "natural_earth.vector" },
                    ),
                ].join(""),
                type: "vector",
            },
        };

        // map style - root
        const style = {
            version: 8,
            name: "Otrails development map",
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
