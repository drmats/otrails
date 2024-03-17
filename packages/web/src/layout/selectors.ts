/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { createSelector } from "reselect";

import type { RootState } from "~web/store/types";




export const selectLoading = (s: RootState) => s.layout.loading;

export const selectThemeLanguage = (s: RootState) => s.layout.themeLanguage;

export const selectTheme = (s: RootState) => s.layout.theme;

export const selectThemePreference = (s: RootState) => s.layout.themePreference;

export const selectDateLocale = (s: RootState) => s.layout.dateLocale;

export const selectLayoutDimensions = (s: RootState) => s.layout.dimensions;

export const selectHtmlDimensions = createSelector(
    [selectLayoutDimensions],
    (layoutDimensions) => layoutDimensions.html,
);

export const selectWindowInnerDimensions = createSelector(
    [selectLayoutDimensions],
    (layoutDimensions) => layoutDimensions.windowInner,
);

export const selectWindowOuterDimensions = createSelector(
    [selectLayoutDimensions],
    (layoutDimensions) => layoutDimensions.windowOuter,
);

export const selectInIframe = (s: RootState) => s.layout.inIframe;

export const selectBottomDrawerOpen = (s: RootState) =>
    s.layout.bottomDrawerOpen;

export const selectMapSelectionInspectVisible = (s: RootState) =>
    s.layout.mapSelectionInspectVisible;
