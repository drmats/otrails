/**
 * Theme language.
 *
 * @module @xcmats/framework-language
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { isString } from "@xcmats/js-toolbox/type";




/**
 * Languages.
 */
export enum ThemeLanguage {
    EN = "en",
    PL = "pl",
}




/**
 * Default language if not set / not detected / not stored.
 */
export const FALLBACK_LANGUAGE = ThemeLanguage.EN;




/**
 * Theme language type predicate.
 */
export const isThemeLanguage = (lang: unknown): lang is ThemeLanguage =>
    isString(lang) && Object.values<string>(ThemeLanguage).includes(lang);
