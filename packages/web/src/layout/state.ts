/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { LayoutDimensions } from "~web/layout/types";
import { ThemeLanguage } from "~common/framework/language";
import { ThemePreference, ThemeVariant } from "~common/framework/theme";
import { dimensions } from "~web/layout/types";




/**
 * Layout initial state.
 */
export default {

    loading: false,

    theme: ThemeVariant.LIGHT,
    themeLanguage: undefined as ThemeLanguage | undefined,
    themePreference: ThemePreference.SYSTEM,

    dateLocale: "en",

    dimensions: {
        windowInner: dimensions(0, 0),
        windowOuter: dimensions(0, 0),
        html: dimensions(0, 0),
    } as LayoutDimensions,

    inIframe: false,

    bottomDrawerOpen: false,
    mapInspectVisible: false,

};
