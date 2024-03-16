/**
 * Map thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { StyleSpecification } from "maplibre-gl";

import type { ThunkType } from "~web/store/types";
import type {
    MapStyleSourcesResponseOk,
    TileSourcesResponseOk,
} from "~common/app/actions/map";
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
            .sources
            .filter((ts) => ts.type === "basemap" && (
                ts.format === "jpg" || ts.format === "jpeg" ||
                ts.format === "png" || ts.format === "webp"
            ))
            .map((ts) => ts.name);
    };




/**
 * List available map style sources.
 */
export const mapStyleSources = (): ThunkType<Promise<MapStyleSourcesResponseOk>> =>
    async (_d, _getState, { tnk }) => {
        return await tnk.network.jsonRequest(
            ACTION.mapStyleSources,
        ) as MapStyleSourcesResponseOk;
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
 * Set map style source index (effectively changing map style source),
 * but first stop all eventual map animations.
 */
export const setMapStyleSourceIndex = (
    mapStyleSourceIndex: number,
    settingMapStyleSourceIndexProgress?: (s: boolean) => void,
): ThunkType =>
    async (_d, _getState, { act, mut }) => {
        if (settingMapStyleSourceIndexProgress)
            settingMapStyleSourceIndexProgress(true);
        const map = mut?.map?.getMap();
        if (map) { map.stop(); }
        setTimeout(() => {
            act.map.SET_MAPSTYLE_SOURCE_INDEX(mapStyleSourceIndex);
            if (settingMapStyleSourceIndexProgress)
                settingMapStyleSourceIndexProgress(false);
        }, 100);
    };




/**
 * Get otrails track style.
 */
export const getTrackStyle = (): ThunkType<Promise<StyleSpecification>> =>
    async (_d, _getState, { tnk }) =>
        await tnk.network.jsonRequest(
            ACTION.trackStyle,
        ) as StyleSpecification;
