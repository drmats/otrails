/**
 * Map constants.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { TileSource } from "~web/map/types";
import { ThemeVariant } from "~common/framework/theme";




/**
 * Tile sources.
 */
export const tileSources: TileSource[] = [
    {
        label: "Otrails main",
        url: "/map/style.json",
        themeVariant: ThemeVariant.LIGHT,
    },
    {
        label: "Natural Earth vector",
        url: "https://klokantech.github.io/naturalearthtiles/maps/natural_earth.vector.json",
        themeVariant: ThemeVariant.LIGHT,
    },
    {
        label: "MapLibre demo tiles",
        url: "https://demotiles.maplibre.org/style.json",
        themeVariant: ThemeVariant.LIGHT,
    },
];