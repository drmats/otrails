/**
 * Map thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";
import type { TileSourcesResponseOk } from "~common/app/actions/tile";
import type { MapViewport } from "~web/map/types";
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




/**
 * Set map viewport, but first stop all eventual map animations.
 */
export const setViewport = (
    viewport: Partial<MapViewport>,
    settingViewportProgress?: (s: boolean) => void,
): ThunkType =>
    async (_d, _getState, { act, mut }) => {
        if (settingViewportProgress) settingViewportProgress(true);
        const map = mut?.map?.getMap();
        if (map) { map.stop(); }
        setTimeout(() => {
            act.map.SET_VIEWPORT(viewport);
            if (settingViewportProgress) settingViewportProgress(false);
        }, 100);
    };




/**
 * Set tile source index (effectively changing tile source),
 * but first stop all eventual map animations.
 */
export const setTileSourceIndex = (
    tileSourceIndex: number,
    settingTileSourceIndexProgress?: (s: boolean) => void,
): ThunkType =>
    async (_d, _getState, { act, mut }) => {
        if (settingTileSourceIndexProgress)
            settingTileSourceIndexProgress(true);
        const map = mut?.map?.getMap();
        if (map) { map.stop(); }
        setTimeout(() => {
            act.map.SET_TILESOURCE_INDEX(tileSourceIndex);
            if (settingTileSourceIndexProgress)
                settingTileSourceIndexProgress(false);
        }, 100);
    };
