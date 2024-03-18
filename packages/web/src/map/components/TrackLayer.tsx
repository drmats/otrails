/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FC } from "react";
import { Layer } from "react-map-gl/maplibre";

import { TRACK_COLOR, TRACK_LAYER_FILTER } from "~common/app/models/track";




/**
 * Otrails track layer.
 */
const TrackLayer: FC<{
    type: keyof typeof TRACK_LAYER_FILTER;
    visible: boolean;
}> = ({ type, visible }) => visible ? (
    <>
        <Layer
            id={`otr-${type}`}
            type="line"
            source="otrails-data"
            source-layer="otrails-track"
            layout={{
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible",
            }}
            paint={{
                "line-blur": [
                    "interpolate", ["linear"], ["zoom"],
                    8, 3,
                    11, 2,
                    16, 0,
                ],
                "line-width": [
                    "interpolate", ["linear"], ["zoom"],
                    4, 0,
                    8, 6,
                    10, 6,
                ],
                "line-color": TRACK_COLOR[type][0],
            }}
            filter={TRACK_LAYER_FILTER[type]()}
        />
        <Layer
            id={`otr-${type}-top`}
            type="line"
            source="otrails-data"
            source-layer="otrails-track"
            layout={{
                "line-cap": "round",
                "line-join": "round",
                "visibility": "visible",
            }}
            paint={{
                "line-blur": 0,
                "line-width": [
                    "interpolate", ["linear"], ["zoom"],
                    4, 0,
                    7, 1,
                    10, 2,
                ],
                "line-color": TRACK_COLOR[type][1],
            }}
            filter={TRACK_LAYER_FILTER[type]()}
        />
    </>
) : null;

export default TrackLayer;
