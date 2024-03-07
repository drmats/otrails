/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */




/**
 * Action response type - list of tile source names.
 */
export type TileSourcesResponseOk = {
    sources: { name: string; format: string }[];
};
