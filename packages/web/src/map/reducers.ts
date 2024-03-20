/**
 * Map reducers.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { sliceReducer } from "red-g";
import { produce } from "immer";

import initState from "~web/map/state";
import act from "~web/map/actions";




/**
 * Map component reducer.
 */
export default sliceReducer(initState) ((slice) => slice

    // full state reset
    .handle(act.RESET, () => initState)

    // set map ready state
    .handle(act.SET_READY, (state, { ready }) => ({
        ...state, ready,
    }))

    // set map style sources
    .handle(act.SET_MAPSTYLE_SOURCES, (state, { mapStyleSources }) => ({
        ...state, mapStyleSources,
    }))

    // set map tilesource index
    .handle(act.SET_MAPSTYLE_SOURCE_INDEX, produce((draft, { mapStyleSourceIndex }) => {
        if (mapStyleSourceIndex < 0)
            draft.mapStyleSourceIndex = 0;
        else if (mapStyleSourceIndex >= draft.mapStyleSources.length)
            draft.mapStyleSourceIndex = draft.mapStyleSources.length - 1;
        else
            draft.mapStyleSourceIndex = mapStyleSourceIndex;
    }))

    // map defaults
    .handle(act.SET_MAX_PITCH, produce((draft, { pitch }) => {
        draft.maxPitch = pitch;
    }))

    // set map viewport
    .handle(act.SET_VIEWPORT, produce((draft, { viewport }) => {
        if (viewport.bearing) draft.viewport.bearing = viewport.bearing;
        if (viewport.latitude) draft.viewport.latitude = viewport.latitude;
        if (viewport.longitude) draft.viewport.longitude = viewport.longitude;
        if (viewport.pitch) draft.viewport.pitch = viewport.pitch;
        if (viewport.zoom) draft.viewport.zoom = viewport.zoom;
    }))

    // set map dimensions
    .handle(act.SET_DIMENSIONS, produce((draft, { dimensions }) => {
        if (dimensions.height) draft.dimensions.height = dimensions.height;
        if (dimensions.width) draft.dimensions.width = dimensions.width;
    }))

    // track layers
    .handle(act.SET_TRACK_LAYERS_VISIBILITY, produce((draft, { visibility }) => {
        draft.trackLayersVisibility = {
            ...draft.trackLayersVisibility,
            ...visibility,
        };
    }))

    // terrain
    .handle(act.SET_TERRAIN_ENABLED, produce((draft, { flag }) => {
        draft.terrainEnabled = flag;
    }))

    // set map selection
    .handle(act.SET_SELECTION, (state, { selection }) => ({
        ...state, selection,
    })),

);
