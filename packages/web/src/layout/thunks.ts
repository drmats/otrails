/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { ThunkType } from "~web/store/types";
import { StorageKey } from "~web/root/config";
import {
    isThemeLanguage,
    ThemeLanguage,
} from "~common/framework/language";
import {
    isThemePreference,
    ThemePreference,
    ThemeVariant,
} from "~common/framework/theme";
import { selectThemePreference } from "~web/layout/selectors";
import {
    changeI18nLanguage,
    detectBrowserLanguage,
} from "~web/layout/localization";




/**
 * Change user theme preference.
 */
export const changeThemePreference = (
    preference: ThemePreference,
): ThunkType =>
    async (_dispatch, _getState, { act, forage }) => {
        await forage.setItem(StorageKey.THEME_PREFERENCE, preference);
        act.layout.SET_THEME_PREFERENCE(preference);
    };




/**
 * Read locally stored user theme preference and store it in redux.
 */
export const readThemePreference = (): ThunkType<Promise<ThemePreference>> =>
    async (dispatch, _getState, { act, forage }) => {
        const preference = await forage.getItem(StorageKey.THEME_PREFERENCE);
        if (isThemePreference(preference)) {
            act.layout.SET_THEME_PREFERENCE(preference);
            return preference;
        } else {
            await dispatch(changeThemePreference(ThemePreference.SYSTEM));
            return ThemePreference.SYSTEM;
        }
    };




/**
 * Set user theme according to theme preference.
 */
export const syncTheme = (): ThunkType =>
    async (_dispatch, getState, { act }) => {
        const state = getState();
        const preference = selectThemePreference(state);
        switch (preference) {
            case ThemePreference.SYSTEM: {
                if (matchMedia("(prefers-color-scheme: dark)").matches) {
                    act.layout.SET_THEME(ThemeVariant.DARK);
                } else {
                    act.layout.SET_THEME(ThemeVariant.LIGHT);
                }
                break;
            }
            case ThemePreference.DARK: {
                act.layout.SET_THEME(ThemeVariant.DARK);
                break;
            }
            case ThemePreference.LIGHT: {
                act.layout.SET_THEME(ThemeVariant.LIGHT);
                break;
            }
        }
    };




/**
 * Change user language.
 * This is "main" thunk responsible for effectively setting frontend
 * client language and changing user setting (if logged in).
 */
export const changeClientThemeLanguage = (
    language: ThemeLanguage,
    _opts?: { updateUserLanguage: boolean },
): ThunkType =>
    async (_dispatch, _getState, { act, forage }) => {
        await changeI18nLanguage(language);
        await forage.setItem(StorageKey.LANGUAGE, language);
        act.layout.SET_THEME_LANGUAGE(language);
    };




/**
 * Read locally stored user language and store it in redux.
 */
export const detectClientThemeLanguage = (): ThunkType<Promise<ThemeLanguage>> =>
    async (dispatch, _getState, { act, forage }) => {
        const sessionLanguage = await forage.getItem(StorageKey.LANGUAGE);
        if (isThemeLanguage(sessionLanguage)) {
            await changeI18nLanguage(sessionLanguage);
            act.layout.SET_THEME_LANGUAGE(sessionLanguage);
            return sessionLanguage;
        } else {
            const browserLanguage = detectBrowserLanguage();
            await dispatch(changeClientThemeLanguage(browserLanguage));
            return browserLanguage;
        }
    };
