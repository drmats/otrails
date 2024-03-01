/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { type FC, type ReactNode, useCallback, useEffect } from "react";
import {
    ThemeProvider as MuiThemeProvider,
    type Theme,
} from "@mui/material/styles";

import { useMemory } from "~web/root/memory";
import { useTheme } from "~web/layout/hooks";
import { DefaultTheme } from "~web/layout/theme";




/**
 * MUI theme provider for animated transitions.
 */
export const WithTransitions: FC<{
    children: ReactNode;
}> = ({ children }) => {
    const enableTransitions = useCallback((t: Theme): Theme => ({
        ...t,
        transitions: {
            ...t.transitions,
            create: DefaultTheme.transitions.create,
        },
    }), []);

    return (
        <MuiThemeProvider theme={enableTransitions}>
            { children }
        </MuiThemeProvider>
    );
};




/**
 * Redux-connected root theme provider.
 */
const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const currentTheme = useTheme();
    const { mut } = useMemory();
    useEffect(() => { mut.theme = currentTheme; }, [mut, currentTheme]);
    return (
        <MuiThemeProvider theme={currentTheme}>
            { children }
        </MuiThemeProvider>
    );
};

export default ThemeProvider;




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Augmenting mutable subcontext.
     */
    interface Mut {
        theme?: ReturnType<typeof useTheme>;
    }

}
