/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { Styles } from "~web/common/types";




/**
 * Helper for `createStyles`-like flow.
 */
export const sxStyles = <T extends Styles>(
    styles: T,
): T => styles;




/**
 * https://github.com/mui/material-ui/blob/23cf0338c2c47a9d6fcae3e407250c4e9f0c6955/packages/mui-material/src/Paper/Paper.js#L13
 */
export const getOverlayAlpha = (elevation: number): number => {
    let alphaValue;
    if (elevation < 1) alphaValue = 5.11916 * elevation ** 2;
    else alphaValue = 4.5 * Math.log(elevation + 1) + 2;
    return Math.floor(alphaValue) / 100;
};
