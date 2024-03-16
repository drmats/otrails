/**
 * Map state shape description.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

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

    // active map selection
    selection: undefined as MapSelection | undefined,

};
