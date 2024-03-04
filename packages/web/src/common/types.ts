/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { Dispatch, SetStateAction } from "react";
import type { SxProps } from "@mui/system";
import type { SystemStyleObject } from "@mui/system";
import type { Theme } from "@mui/material/styles";

import type { ValidKeys } from "~common/lib/type";




/**
 * Generic type for `[state, setState]` tuple (`setState()` return value).
 */
export type StateManagement<State> = readonly [
    State,
    Dispatch<SetStateAction<State>>,
];




/**
 * Generic type for component style overrides.
 */
export type StyleOverrides<StyleKeys extends ValidKeys> = {
    [K in StyleKeys]?:
        | SystemStyleObject<Theme>
        | ((theme: Theme) => SystemStyleObject<Theme>);
};




/**
 * Component stylesheet shape.
 */
export type Styles = Record<string, SxProps<Theme>>;
