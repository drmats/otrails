/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC } from "react";
import Box from "@mui/material/Box";




/**
 * CSS Gradient (position: relative - to use inside absolute container).
 */
const GradientLayer: FC<{
    start: string;
    end: string;
    angle: string;
}> = ({ start, end, angle }) => (
    <Box
        sx={(th) => ({
            backgroundImage:
                `linear-gradient(${angle}, ${start} 0%, ${end} 100%)`,
            ...th.custom.util.layer,
        })}
    />
);

export default GradientLayer;
