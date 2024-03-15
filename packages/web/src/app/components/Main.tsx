/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import { memo, type FC } from "react";
import { lazy, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { choose } from "@xcmats/js-toolbox/func";

import { useMemory } from "~web/root/memory";
import { useSpaNavigation, useSpaRoute } from "~web/router/hooks";
import { useThunkDispatch } from "~web/store/hooks";
import { selectReady } from "~web/app/selectors";
import { useDocumentTitle } from "~web/layout/hooks";
import { isThemeLanguage } from "~common/framework/language";
import { recordModify } from "~common/lib/struct";
import { changeClientThemeLanguage } from "~web/layout/thunks";
import { isThemeVariant } from "~common/framework/theme";
import { SCREEN } from "~common/app/api";
import Body from "~web/layout/components/Body";
import HeroBack from "~web/layout/components/HeroBack";
import ErrorScreen from "~web/layout/screens/Error";

const LandingScreen = lazy(() => import("~web/app/screens/Landing"));
const Layout = lazy(() => import("~web/app/components/Layout"));
const BasicMap = lazy(() => import("~web/map/screens/BasicMap"));




/**
 * Main application component.
 */
export const App: FC = memo(() => {
    const appReady = useSelector(selectReady);
    const { act } = useMemory();
    const dispatch = useThunkDispatch();
    const navigate = useSpaNavigation();
    const route = useSpaRoute();

    useDocumentTitle("Otrails");




    // navigate to landing page if no route was matched
    useEffect(() => {
        if (route.matched === "") navigate.replace(
            SCREEN.landing, { resetQuery: true },
        );
    }, [route.matched]);




    // change theme language setting - query params interface (for iframe)
    useEffect(() => {
        if (appReady && isThemeLanguage(route.query.lang)) {
            void dispatch(changeClientThemeLanguage(route.query.lang));
            navigate.replaceQuery(recordModify(route.query, { lang: null }));
        }
    }, [appReady, route.query]);




    // change theme variant setting - query params interface (for iframe)
    useEffect(() => {
        if (appReady && isThemeVariant(route.query.theme)) {
            act.layout.SET_THEME(route.query.theme);
            navigate.replaceQuery(recordModify(route.query, { theme: null }));
        }
    }, [act, appReady, route.query]);




    // ...
    const screens = useMemo(() => {
        return {
            [SCREEN.landing]: () => (
                <HeroBack withTint>
                    <Layout showControls={false}>
                        <LandingScreen />
                    </Layout>
                </HeroBack>
            ),
            [SCREEN.map]: () => (
                <Layout showControls={false}>
                    <BasicMap />
                </Layout>
            ),
        };
    }, []);




    // ...
    const errorScreen = useCallback(() => (
        <HeroBack withTint>
            <ErrorScreen
                message="Error:wrong_path"
                redirect={SCREEN.landing}
            />
        </HeroBack>
    ), []);




    // ...
    return (
        <Body>
            { choose(route.matched, screens, errorScreen) }
        </Body>
    );
});
