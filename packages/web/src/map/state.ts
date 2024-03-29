/**
 * Map state shape description.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { objectMap } from "@xcmats/js-toolbox/struct";

import { TRACK_LAYER_FILTER } from "~common/app/models/track";
import { mapStyleSources } from "~web/map/constants";
import type { MapSelection } from "~web/map/types";




/**
 * Map component initial state.
 */
export default {

    // is map loaded and ready?
    ready: false,

    // all map style sources
    mapStyleSources,

    // what's the current map style source?
    mapStyleSourceIndex: 0,

    // map defaults and limits
    maxPitch: 85,

    // viewport state
    viewport: {
        bearing: 0,
        latitude: 52.06,
        longitude: 19.85,
        pitch: 0,
        zoom: 5,
    },

    // viewport dimensions
    dimensions: {
        width: 0,
        height: 0,
    },

    // ...
    trackLayersVisibility: objectMap(TRACK_LAYER_FILTER) (([k]) => [k, true]),

    // terrain
    terrainEnabled: false,

    // active map selection
    selection: undefined as MapSelection | undefined,

};
