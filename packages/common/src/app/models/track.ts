/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { propFilter } from "~common/map/lib";




/**
 * Track layer filters.
 */
export const TRACK_LAYER_FILTER = {
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
    bike: () => propFilter (
        "any", "activity_type",
        ["cycling", "road_biking", "gravel_cycling", "mountain_biking"],
    ),
    flight: () => propFilter(
        "any", "activity_type",
        ["paragliding", "tandem_paragliding"],
    ),
    water: () => propFilter(
        "any", "activity_type",
        [
            "kayaking_v2", "open_water_swimming", "rowing_v2",
            "sailing_v2", "whitewater_rafting_kayaking",
        ],
    ),
} as const;




/**
 * Track colors.
 */
export const TRACK_COLOR = {

    run: ["#6A5500CC", "#DEB100EE"],
    walk: ["#592700CC", "#F86C00EE"],
    hike: ["#680015CC", "#D3002AEE"],
    bike: ["#085B00CC", "#11CC00EE"],
    flight: ["#006B82CC", "#00D1FFEE"],
    water: ["#001654CC", "#003EE9EE"],

} as const;
