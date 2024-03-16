/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { sliceReducer } from "red-g";
import { produce } from "immer";

import initState from "~web/layout/state";
import act from "~web/layout/actions";




/**
 * Layout reducer.
 */
export default sliceReducer(initState) ((slice) => slice

    .handle(act.RESET, () => initState)

    .handle(act.LOADING, produce((draft) => { draft.loading = true; }))

    .handle(act.LOADED, produce((draft) => { draft.loading = false; }))

    .handle(act.SET_THEME, produce((draft, { theme }) => {
        draft.theme = theme;
    }))

    .handle(act.SET_THEME_LANGUAGE, produce((draft, { themeLanguage }) => {
        draft.themeLanguage = themeLanguage;
    }))

    .handle(act.SET_THEME_PREFERENCE, produce((draft, { themePreference }) => {
        draft.themePreference = themePreference;
    }))

    .handle(act.SET_DATE_LOCALE, produce((draft, { dateLocale }) => {
        draft.dateLocale = dateLocale;
    }))

    .handle(act.SET_DIMENSIONS, produce((draft, { dimensions }) => {
        draft.dimensions = dimensions;
    }))

    .handle(act.SET_IN_IFRAME, produce((draft, { flag }) => {
        draft.inIframe = flag;
    }))

    .handle(act.SET_BOTTOM_DRAWER_OPEN, produce((draft, { flag }) => {
        draft.bottomDrawerOpen = flag;
    })),

);
