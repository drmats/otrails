/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { Suspense, type FC, type ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

import { appMemory } from "~web/root/memory";
import { selectBottomDrawerOpen } from "~web/layout/selectors";
import { selectReady } from "~web/app/selectors";
import {
    useInIframe,
    useIsMobile,
    useIsThemeLight,
    useTheme,
} from "~web/layout/hooks";
import ErrorBoundary from "~web/layout/components/ErrorBoundary";
import HeroBack from "~web/layout/components/HeroBack";
import Loader from "~web/layout/components/Loader";
import MenuFab from "~web/layout/components/MenuFab";
import BottomDrawer from "~web/app/components/BottomDrawer";
import { useSpaRoute } from "~web/router/hooks";
import { SCREEN } from "~common/app/api";




/**
 * ...
 */
const { act } = appMemory();




/**
 * Application body wrapper.
 */
const Body: FC<{ children: ReactNode }> = ({ children }) => {
    const route = useSpaRoute();
    const appReady = useSelector(selectReady);
    const theme = useTheme();
    const lightTheme = useIsThemeLight();
    const isMobile = useIsMobile();
    const inIframe = useInIframe();

    const userAgent = useMemo(() => navigator.userAgent, []);
    const isFfOnLinux = useMemo(
        () => userAgent.includes("Firefox") && userAgent.includes("Linux"),
        [userAgent],
    );

    // "sky" for map views
    const bodyBackgroundImage = useMemo(() => {
        if (route.matched !== SCREEN.landing) {
            if (lightTheme) return [
                "linear-gradient(",
                "180deg, ",
                `${theme.palette.primary.main} `,
                "0%, ",
                `${theme.custom.background.bodyColor} `,
                "100%",
                ")",
            ].join("");
            return [
                "linear-gradient(",
                "0deg, ",
                `${theme.palette.primary.dark} `,
                "0%, ",
                `${theme.custom.background.bodyColor} `,
                "100%",
                ")",
            ].join("");
        }
        return "none";
    }, [
        lightTheme,
        route.matched,
        theme.custom.background.bodyColor,
        theme.palette.primary.dark,
        theme.palette.primary.main,
    ]);

    const bottomDrawerOpen = useSelector(selectBottomDrawerOpen);

    return (
        <>
            <CssBaseline enableColorScheme />
            <GlobalStyles
                styles={{
                    html: inIframe ? { colorScheme: "initial" } : {},
                    body: {
                        backgroundColor:
                            inIframe
                                ? theme.custom.background.bodyIframeColor
                                : theme.custom.background.bodyColor,
                        backgroundImage: bodyBackgroundImage,
                        position: "fixed",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                    },
                    "*": {
                        scrollbarWidth: isFfOnLinux ? "auto" : "thin",
                        scrollbarColor: lightTheme ? "#777 #ccc" : "#666 #333",
                        WebkitTapHighlightColor: "transparent",
                        userSelect: isMobile ? "none" : "initial",
                    },
                    "::-webkit-scrollbar": { width: "8px" },
                    "::-webkit-scrollbar-track": {
                        background: lightTheme ? "#ccc" : "#333",
                    },
                    "::-webkit-scrollbar-thumb": {
                        borderRadius: "4px",
                        background: lightTheme ? "#777" : "#666",
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                        background: lightTheme ? "#444" : "#999",
                    },
                }}
            />
            <MenuFab />
            <BottomDrawer
                open={bottomDrawerOpen}
                onOpen={() => { act.layout.SET_BOTTOM_DRAWER_OPEN(true); }}
                onClose={() => { act.layout.SET_BOTTOM_DRAWER_OPEN(false); }}
            />
            <ErrorBoundary>
                <Suspense fallback={<HeroBack withTint><Loader /></HeroBack>}>
                    { appReady ? children : <Loader /> }
                </Suspense>
            </ErrorBoundary>
        </>
    );
};

export default Body;
