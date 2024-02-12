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

    tileGet: "/tile/get/:name/:z/:x/:y/t.pbf",
    tileJson: "/tile/schema/:name.json",
    tileSources: "/tile/sources/",

} as const;
