/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { ComponentProps, FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { StyleOverrides } from "~web/common/types";
import { sxStyles } from "~web/common/utils";




/**
 * ...
 */
const sx = sxStyles({
    headingContainer: (th) => ({
        display: "inline-flex",
        flexDirection: "row",
        gap: th.spacing(2),
        alignItems: "center",
        userSelect: "none",
    }),
    disabled: (th) => ({
        color: th.palette.text.disabled,
    }),
});




/**
 * Section heading (title) with an optional icon.
 */
const Heading: FC<{
    label: string;
    icon?: JSX.Element;
    disabled?: boolean;
    variant?: ComponentProps<typeof Typography>["variant"];
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ label, icon, disabled, variant, overrides }) => (
    <Box
        sx={[
            sx.headingContainer,
            overrides?.headingContainer ?? {},
        ]}
    >
        { icon && (
            <Box
                sx={[
                    { display: "flex" },
                    ...(disabled ? [
                        sx.disabled,
                        overrides?.disabled ?? {},
                    ] : [{}]),
                ]}
            >
                { icon }
            </Box>
        ) }
        <Box sx={{ display: "flex" }}>
            <Typography
                variant={variant ?? "h6"}
                sx={disabled ? [
                    sx.disabled,
                    overrides?.disabled ?? {},
                ] : {}}
            >
                { label }
            </Typography>
        </Box>
    </Box>
);

export default Heading;
