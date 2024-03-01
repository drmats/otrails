/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { sxStyles } from "~web/common/utils";




/**
 * Height-dependent styles.
 */
export const outerStyles = (height: number) => sxStyles({
    container: (th) => ({
        [th.breakpoints.down("md")]: { padding: 0 },
        [th.breakpoints.up("md")]: { padding: th.spacing(1) },
    }),
    content: (th) => ({
        display: "flex",
        flexDirection: "column",
        gap: th.spacing(1),
        [th.breakpoints.down("md")]: {
            height: `${height}px`,
        },
        [th.breakpoints.up("md")]: {
            height: `calc(${height}px - ${th.spacing(2)})`,
        },
        overflowX: "hidden",
        overflowY: "auto",
    }),
});




/**
 * Common styles.
 */
export const commonStyles = sxStyles({
    mobileContent: (th) => ({
        [th.breakpoints.down("md")]: {
            "& > .MuiPaper-root": { pt: 2, pb: 2 },
            gap: 0,
        },
    }),
    surface: (th) => ({
        [th.breakpoints.up("md")]: {
            ml: 0,
            mr: 0,
        },
        padding: th.spacing(2),
        "&.lockX": { overflowX: "hidden" },
    }),
    contentMargin: {
        mt: 2,
        ml: 2,
    },
});
