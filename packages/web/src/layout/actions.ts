/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";

import type { LayoutDimensions } from "~web/layout/types";
import { ThemeLanguage } from "~common/framework/language";
import { ThemePreference, ThemeVariant } from "~common/framework/theme";




/**
 * Layout action types.
 */
export enum LayoutActionType {

    RESET = "Layout/RESET",

    LOADING = "Layout/LOADING",
    LOADED = "Layout/LOADED",

    SET_THEME = "Layout/SET_THEME",
    SET_THEME_LANGUAGE = "Layout/SET_THEME_LANGUAGE",
    SET_THEME_PREFERENCE = "Layout/SET_THEME_PREFERENCE",

    SET_DATE_LOCALE = "Layout/SET_DATE_LOCALE",

    SET_DIMENSIONS = "Layout/SET_DIMENSIONS",

    SET_IN_IFRAME = "Layout/SET_IN_IFRAME",

}




/**
 * Layout action creators.
 */
export default actionCreators(LayoutActionType, {

    SET_THEME: (theme: ThemeVariant) => ({ theme }),

    SET_THEME_LANGUAGE: (themeLanguage: ThemeLanguage) => ({ themeLanguage }),

    SET_THEME_PREFERENCE: (themePreference: ThemePreference) => ({
        themePreference,
    }),

    SET_DATE_LOCALE: (dateLocale: string) => ({ dateLocale }),

    SET_DIMENSIONS: (dimensions: LayoutDimensions) => ({ dimensions }),

    SET_IN_IFRAME: (flag: boolean) => ({ flag }),

});
