/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { propFilter } from "~common/map/lib";




/**
 * Used colors.
 */
export const TRACK_COLOR = {

    flying: ["#006B82CC", "#00D1FFEE"],
    biking: ["#085B00CC", "#11CC00EE"],
    running: ["#6A5500CC", "#DEB100EE"],
    walking: ["#592700CC", "#F86C00EE"],
    hiking: ["#680015CC", "#D3002AEE"],
    watering: ["#001654CC", "#003EE9EE"],

} as const;




/**
 * Layer filters.
 */
export const LAYER_FILTER = {
    bike: () => propFilter (
        "any", "activity_type",
        ["cycling", "road_biking", "gravel_cycling", "mountain_biking"],
    ),
    flight: () => propFilter(
        "any", "activity_type",
        ["paragliding", "tandem_paragliding"],
    ),
    run: () => propFilter(
        "any", "activity_type",
        ["running", "trail_running"],
    ),
    walk: () => propFilter(
        "any", "activity_type",
        ["walking", "casual_walking", "speed_walking"],
    ),
    hike: () => propFilter(
        "any", "activity_type",
        ["hiking", "rock_climbing"],
    ),
    water: () => propFilter(
        "any", "activity_type",
        [
            "kayaking_v2", "open_water_swimming", "rowing_v2",
            "sailing_v2", "whitewater_rafting_kayaking",
        ],
    ),
};
