/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { isString } from "@xcmats/js-toolbox/type";




/**
 * Theme variants.
 */
export enum ThemeVariant {
    DARK = "dark",
    LIGHT = "light",
}




/**
 * Theme variant type predicate.
 */
export const isThemeVariant = (pref: unknown): pref is ThemeVariant =>
    isString(pref) && Object.values<string>(ThemeVariant).includes(pref);




/**
 * Theme preferences.
 */
export enum ThemePreference {
    DARK = "dark",
    LIGHT = "light",
    SYSTEM = "system",
}




/**
 * Theme preference type predicate.
 */
export const isThemePreference = (pref: unknown): pref is ThemePreference =>
    isString(pref) && Object.values<string>(ThemePreference).includes(pref);
