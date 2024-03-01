/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import {
    createTheme,
    type Theme,
    type ThemeOptions,
} from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import { blue, grey, orange } from "@mui/material/colors";
import { enUS, plPL } from "@mui/material/locale";
import { rgba } from "@xcmats/js-toolbox/utils";

import type { DeepPartial } from "~common/lib/type";
import { ThemeLanguage } from "~common/framework/language";
import { ThemeVariant } from "~common/framework/theme";




/**
 * Custom theme constants.
 */
declare module "@mui/material/styles" {

    interface Theme {
        custom: {
            background: {
                backdropColor: string;
                bodyColor: string;
                bodyGradient: string;
                bodyIframeColor: string;
                desaturateFilter: string;
                headerColor: string;
                heroImage: SystemStyleObject<Theme>;
                topBar: string;
            };
            util: {
                layer: SystemStyleObject<Theme>;
            };
        };
    }

    interface ThemeOptions {
        custom?: DeepPartial<Theme["custom"]>;
    }

}




/**
 * Default MUI theme.
 */
export const DefaultTheme: Theme = createTheme();




/**
 * Common theme properties.
 */
const CommonThemeOptions: ThemeOptions = {
    components: {
        MuiDialog: {
            defaultProps: {
                transitionDuration: 0,
            },
        },
        MuiDialogContentText: {
            styleOverrides: {
                root: {
                    whiteSpace: "pre-wrap",
                },
            },
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    overflowX: "hidden",
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: 3,
                },
            },
        },
        MuiLink: {
            defaultProps: {
                underline: "hover",
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 1,
            },
            styleOverrides: {
                root: {
                    overflowX: "auto",
                    overflowY: "auto",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: "6px 8px",
                },
            },
        },
    },
    custom: {
        background: {
            backdropColor: rgba(0, 0, 0, 0.5),
            bodyIframeColor: "transparent",
            heroImage: {
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "50% 33%",
            },
        },
        util: {
            layer: {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
            },
        },
    },
    transitions: {
        create: () => "none",
    },
};




/**
 * Custom theme - dark variant.
 */
export const DarkTheme: Theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: "#77777788",
                },
            },
        },
    },
    custom: {
        background: {
            bodyColor: "#131313",
            bodyGradient: "linear-gradient(160deg, #04619F 0%, #000 100%)",
            desaturateFilter: "saturate(0.70)",
            headerColor: "#102036",
            topBar: "#00193d",
        },
    },
    palette: {
        mode: "dark",
        background: {
            default: "#191a1b",
            paper: "#191a1b",
        },
        primary: {
            main: blue[400],
        },
        secondary: {
            main: orange[400],
        },
        text: {
            disabled: "#ffffff55",
            primary: grey[300],
            secondary: "#ffffff99",
        },
    },
}, CommonThemeOptions);




/**
 * Custom theme - light variant.
 */
export const LightTheme: Theme = createTheme({
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottomColor: "#AAAAAA88",
                },
            },
        },
    },
    custom: {
        background: {
            bodyColor: "#dedede",
            bodyGradient: "linear-gradient(160deg, #bdbdbd 0%, #fff 60%)",
            desaturateFilter: "saturate(0.35)",
            headerColor: "#f5f5f5",
            topBar: blue[800],
        },
    },
    palette: {
        mode: "light",
        background: {
            default: grey[100],
            paper: grey[100],
        },
        primary: {
            main: blue[800],
        },
        secondary: {
            main: orange[800],
        },
        text: {
            disabled: "#00000044",
            primary: grey[900],
            secondary: "#000000aa",
        },
    },
}, CommonThemeOptions);




/**
 * Theme "registry".
 */
export const Themes = {
    [ThemeVariant.DARK]: {
        [ThemeLanguage.EN]: createTheme(DarkTheme, enUS),
        [ThemeLanguage.PL]: createTheme(DarkTheme, plPL),
    },
    [ThemeVariant.LIGHT]: {
        [ThemeLanguage.EN]: createTheme(LightTheme, enUS),
        [ThemeLanguage.PL]: createTheme(LightTheme, plPL),
    },
};
