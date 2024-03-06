/**
 * Map thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";
import type { TileSourcesResponseOk } from "~common/app/actions/tile";
import { ACTION } from "~common/app/api";




/**
 * List all available tile sources (names and formats).
 */
export const tileSources = (): ThunkType<Promise<TileSourcesResponseOk>> =>
    async (_d, _getState, { tnk }) => {
        return await tnk.network.jsonRequest(
            ACTION.tileSources,
        ) as TileSourcesResponseOk;
    };




/**
 * List all available raster tile sources (names).
 */
export const tileRasterSources = (): ThunkType<Promise<string[]>> =>
    async (dispatch) => {
        return (await dispatch(tileSources()))
            .sources.filter((ts) => (
                ts.format === "jpg" || ts.format === "jpeg" ||
                ts.format === "png" || ts.format === "webp"
            ))
            .map((ts) => ts.name);
    };
