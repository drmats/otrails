/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { devEnv } from "@xcmats/js-toolbox/utils";

import {
    FALLBACK_LANGUAGE,
    ThemeLanguage,
} from "~common/framework/language";




/**
 * Initialize and configure i18n.
 */
export const i18nSetup = async (): Promise<void> => {
    void i18n.use(initReactI18next).init({
        debug: devEnv(),
        fallbackLng: [FALLBACK_LANGUAGE, ThemeLanguage.PL],
        interpolation: {
            escapeValue: false,
        },
    });
};




/**
 * Dynamically load resources and change language.
 */
export const changeI18nLanguage = async (
    language: ThemeLanguage,
): Promise<void> => {
    let entries = [];
    let lang: string;

    if (language === ThemeLanguage.PL) {
        entries = Object.entries(
            (await import("~common/app/translations/pl")).default,
        );
        lang = language;
    } else {
        entries = Object.entries(
            (await import("~common/app/translations/en")).default,
        );
        lang = ThemeLanguage.EN;
    }

    entries.forEach(([ns, translations]) =>
        i18n.addResourceBundle(lang, ns, translations, false, true),
    );
    await i18n.changeLanguage(lang);
};




/**
 * Detect browser language and return matching ThemeLanguage.
 */
export const detectBrowserLanguage = (): ThemeLanguage => {
    if (/^pl\b/.test(navigator.language)) return ThemeLanguage.PL;
    else return FALLBACK_LANGUAGE;
};
