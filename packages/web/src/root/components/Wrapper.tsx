/**
 * Root frontend application component.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import { Suspense, type FC, type ReactNode, useEffect, useMemo } from "react";
import type { Store } from "redux";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import type { Action } from "red-g";
import PropTypes, { type InferProps } from "prop-types";
import type { Locale } from "dayjs/locale/en";
import dayjsLocaleEN from "dayjs/locale/en";
import dayjsLocalePL from "dayjs/locale/pl";

import type { RootState } from "~web/store/types";
import { useMemory } from "~web/root/memory";
import {
    FALLBACK_LANGUAGE,
    ThemeLanguage,
} from "~common/framework/language";
import { selectThemeLanguage } from "~web/layout/selectors";
import ThemeProvider from "~web/layout/components/ThemeProvider";
import Loader from "~web/layout/components/Loader";




/**
 * Root element propTypes definition.
 */
const rootPropTypes = {
    element: PropTypes.node.isRequired,
} as const;
type RootType = FC<InferProps<typeof rootPropTypes>>;




/**
 * Root-wrapping element creation.
 */
export default function createRootWrapper (
    store: Store<RootState, Action>,
): RootType {

    // date/time localizations
    const dateLocales = {
        [ThemeLanguage.EN]: dayjsLocaleEN as Locale,
        [ThemeLanguage.PL]: dayjsLocalePL as Locale,
    } as const;


    // all top-level providers
    const Providers: FC<{
        children: ReactNode;
    }> = ({ children }) => {
        const { act, dayjs } = useMemory();
        const currentThemeLanguage = useSelector(selectThemeLanguage);

        const dayjsLocale = useMemo(
            () => dateLocales[currentThemeLanguage ?? FALLBACK_LANGUAGE].name,
            [currentThemeLanguage],
        );

        useEffect(() => {
            dayjs.locale(dayjsLocale);
            act.layout.SET_DATE_LOCALE(dayjsLocale);
        }, [act, dayjs, dayjsLocale]);

        return (
            <ThemeProvider>
                <Suspense fallback={<Loader />}>
                    { children }
                </Suspense>
            </ThemeProvider>
        );
    };


    // top-level - redux provider
    const Root: RootType = ({ element }) => (
        <ReduxProvider store={store}>
            <Providers>
                { element }
            </Providers>
        </ReduxProvider>
    );

    // ...
    Root.propTypes = rootPropTypes;


    return Root;
}
