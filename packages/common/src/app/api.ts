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
    tileGet: "/tile/get/:name/:z/:x/:y/t.pbf",
    tileSources: "/tile/sources/",

} as const;
