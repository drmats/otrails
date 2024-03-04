/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { FC, ReactNode } from "react";
import Paper from "@mui/material/Paper";
import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";
import { isArray } from "@xcmats/js-toolbox/type";

import { useTheme, useIsMobile } from "~web/layout/hooks";




/**
 * Responsive mobile/desktop paper.
 */
const MobilePaper: FC<{
    children?: ReactNode;
    mobileElevate?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
}> = ({ children, mobileElevate, sx, className }) => {
    const theme = useTheme();
    const isMobile = useIsMobile();

    return (
        <Paper
            elevation={
                isMobile && !mobileElevate
                    ? 0
                    : theme.components?.MuiPaper?.defaultProps?.elevation
            }
            square={isMobile}
            sx={[
                { flexShrink: 0 },
                ...(isArray(sx) ? sx : sx ? [sx] : []),
            ]}
            className={className}
        >
            { children }
        </Paper>
    );
};

export default MobilePaper;
