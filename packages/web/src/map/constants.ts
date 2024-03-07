/**
 * Map constants.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { TileSource } from "~web/map/types";
import { ThemeVariant } from "~common/framework/theme";
import { ACTION } from "~common/app/api";




/**
 * Tile sources.
 */
export const tileSources: TileSource[] = [
    {
        label: "otrails",
        url: ACTION.mapStyle,
        themeVariant: ThemeVariant.LIGHT,
    },
    {
        label: "ne_vector",
        url: "https://klokantech.github.io/naturalearthtiles/maps/natural_earth.vector.json",
        themeVariant: ThemeVariant.LIGHT,
    },
    {
        label: "maplibre_demo",
        url: "https://demotiles.maplibre.org/style.json",
        themeVariant: ThemeVariant.LIGHT,
    },
];
