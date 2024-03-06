/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { StyleSpecification } from "maplibre-gl";




/**
 * Overlay one map style over another.
 */
export const mergeMapStyles = (
    base: StyleSpecification,
    overlay: StyleSpecification,
): StyleSpecification => ({
    ...base,
    name: "Otrails overlay",
    bearing: 0,
    center: [49.9055, 13.5086],
    pitch: 0,
    zoom: 5,
    sources: {
        ...base.sources,
        ...overlay.sources,
    },
    layers: [
        ...base.layers,
        ...overlay.layers,
    ],
});
