/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */




/**
 * Service routes.
 */
export const ACTION = {

    hello:            "/",

    static:           "/static/",

    mapOtrailsStyle:  "/map/otrails/style.json",
    mapRasterStyle:   "/map/raster/:name/style.json",
    mapTrackStyle:    "/map/otrails/tracks/style.json",

    mapStyleSources:  "/map/style/sources/",

    networkProxy:     "/network/proxy/",

    tileGetJpg:       "/tile/get/:name/:z/:x/:y/t.jpg",
    tileGetPbf:       "/tile/get/:name/:z/:x/:y/t.pbf",
    tileGetPng:       "/tile/get/:name/:z/:x/:y/t.png",
    tileGetWebp:      "/tile/get/:name/:z/:x/:y/t.webp",
    tileJson:         "/tile/schema/:name.json",
    tileSources:      "/tile/sources/",

} as const;




/**
 * Web routes.
 */
export const SCREEN = {

    landing:    "/",

    map:        "/map/",

    notFound:   "/404/",

} as const;
