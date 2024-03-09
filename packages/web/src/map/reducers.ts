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

    // set map tilesources
    .handle(act.SET_TILESOURCES, (state, { tileSources }) => ({
        ...state, tileSources,
    }))

    // set map tilesource index
    .handle(act.SET_TILESOURCE_INDEX, produce((draft, { tileSourceIndex }) => {
        if (tileSourceIndex < 0)
            draft.tileSourceIndex = 0;
        else if (tileSourceIndex >= draft.tileSources.length)
            draft.tileSourceIndex = draft.tileSources.length - 1;
        else
            draft.tileSourceIndex = tileSourceIndex;
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
    })),

);
