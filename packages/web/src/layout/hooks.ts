/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useMemory } from "~web/root/memory";
import { selectTopbarTitle } from "~web/app/selectors";
import {
    selectDateLocale,
    selectHtmlDimensions,
    selectInIframe,
    selectTheme,
    selectThemeLanguage,
} from "~web/layout/selectors";
import { Themes } from "~web/layout/theme";
import { FALLBACK_LANGUAGE } from "~common/framework/language";
import type { Styles } from "~web/common/types";
import type { Dimensions } from "~web/layout/types";




/**
 * Return current theme.
 */
export const useTheme = (): Theme =>
    Themes[
        useSelector(selectTheme)
    ][
        useSelector(selectThemeLanguage) ?? FALLBACK_LANGUAGE
    ];




/**
 * Set document title on component mount, revert on umount.
 */
export const useDocumentTitle = (title: string, append = false): void => {
    const originalTopbarTitleRef = useRef(useSelector(selectTopbarTitle));
    const { act } = useMemory();
    useEffect(() => {
        const originalTitle = document.title;
        const originalTopbarTitle = originalTopbarTitleRef.current;
        if (append) {
            document.title += ` - ${title}`;
            act.app.SET_TOPBAR_TITLE(title);
        }
        else document.title = title;
        return () => {
            document.title = originalTitle;
            if (append) act.app.SET_TOPBAR_TITLE(originalTopbarTitle);
        };
    }, [act, append, title]);
};




/**
 * Black or white?
 */
export const useIsThemeLight = (): boolean => {
    const theme = useTheme();
    return theme.palette.mode === "light";
};




/**
 * Is screen size mobile?
 */
export const useIsMobile = (): boolean => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down("md"));
};




/**
 * Is app empedded in iframe?
 */
export const useInIframe = (): boolean => {
    const inIframe = useSelector(selectInIframe);
    return inIframe;
};




/**
 * Get usable surface (html) dimensions.
 */
export const useDimensions = (): Dimensions =>
    useSelector(selectHtmlDimensions);




/**
 * Helper for dynamic styles (external-parameters-dependent).
 */
export const useStyles = <T extends Styles, P, PS extends P[]>(
    createStyles: (...params: PS) => T,
    ...params: PS
): T => {
    return useMemo(() => createStyles(...params), [createStyles, params]);
};




/**
 * Locale-changing dayjs.
 */
export const useDayjs = (): Ctx["dayjs"] => {
    const { dayjs } = useMemory();
    const currentDateLocale = useSelector(selectDateLocale);
    const [currentDayJs, setCurrentDayJs] = useState<Ctx["dayjs"]>(
        () => Object.assign(<T extends any[]>(...p: T) => dayjs(...p), dayjs),
    );
    useEffect(() => {
        setCurrentDayJs(() => Object.assign(
            <T extends any[]>(...p: T) => dayjs(...p), dayjs,
        ));
    }, [currentDateLocale, dayjs]);
    return currentDayJs;
};




/**
 * Give usable layout height in pixels.
 * If `withAppBar` parameter is set to `true` then usable height
 * is reduced by the height of app bar.
 */
export const useHeight = (opts?: { withAppBar?: boolean }): number => {
    const theme = useTheme();
    const { height } = useDimensions();
    const usableHeight = useMemo(
        () => opts?.withAppBar ? height - parseInt(theme.spacing(6)) : height,
        [theme, height, opts],
    );
    return usableHeight;
};
