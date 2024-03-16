/**
 * Map constants.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { MapStyleSource } from "~common/map/types";
import { ThemeVariant } from "~common/framework/theme";
import { ACTION } from "~common/app/api";




/**
 * Map style sources.
 */
export const mapStyleSources: MapStyleSource[] = [
    {
        label: "otrails",
        url: ACTION.mapOtrailsStyle,
        themeVariant: ThemeVariant.LIGHT,
    },
];
