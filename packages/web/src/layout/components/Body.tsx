/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { Suspense, type FC, type ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";

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




/**
 * Application body wrapper.
 */
const Body: FC<{ children: ReactNode }> = ({ children }) => {
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
            <ErrorBoundary>
                <Suspense fallback={<HeroBack withTint><Loader /></HeroBack>}>
                    { appReady ? children : <Loader /> }
                </Suspense>
            </ErrorBoundary>
        </>
    );
};

export default Body;
