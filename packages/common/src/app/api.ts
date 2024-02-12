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

    hello: "/",

    static: "/static/",

    tileGetPbf: "/tile/get/:name/:z/:x/:y/t.pbf",
    tileGetPng: "/tile/get/:name/:z/:x/:y/t.png",
    tileGetWebp: "/tile/get/:name/:z/:x/:y/t.webp",
    tileJson: "/tile/schema/:name.json",
    tileSources: "/tile/sources/",

} as const;
