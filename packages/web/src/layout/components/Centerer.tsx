/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC, ReactNode } from "react";
import { isArray } from "@xcmats/js-toolbox/type";
import type { Theme } from "@mui/material/styles";
import type { SxProps, SystemStyleObject } from "@mui/system";
import Grid from "@mui/material/Grid";




/**
 * Place child in the horizontal and vertical center of the screen.
 */
const Centerer: FC<{
    children: ReactNode;
    innerStyleOverrides?: SxProps<Theme>;
    outerStyleOverrides?:
        | (
            | SystemStyleObject<Theme>
            | ((theme: Theme) => SystemStyleObject<Theme>)
        )[]
        | SystemStyleObject<Theme>
        | ((theme: Theme) => SystemStyleObject<Theme>);
    withAppBar?: boolean;
}> = ({ children, innerStyleOverrides, outerStyleOverrides, withAppBar }) => (
    <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={[(th) => ({
            width: "100%",
            height: withAppBar ? `calc(100% - ${th.spacing(6)})` : "100%",
        }), ...(
            isArray(outerStyleOverrides) ?
                outerStyleOverrides :
                outerStyleOverrides ?
                    [outerStyleOverrides] :
                    []
        )]}
    >
        <Grid sx={innerStyleOverrides} item>
            { children }
        </Grid>
    </Grid>
);

export default Centerer;
