/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC, ReactNode } from "react";
import { toBool } from "@xcmats/js-toolbox/type";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";

import { sxStyles } from "~web/common/utils";
import { useInIframe, useIsMobile, useStyles } from "~web/layout/hooks";
import GradientLayer from "~web/common/components/GradientLayer";




/**
 * ...
 */
const createStyles = (
    desaturate?: string,
) => sxStyles({
    heroContainer: {
        position: "relative",
    },
    blackBack: (th) => ({
        backgroundColor: "#000",
        ...th.custom.util.layer,
    }),
    heroImage: (th) => ({
        filter: desaturate ?? th.custom.background.desaturateFilter,
        ...th.custom.background.heroImage,
        ...th.custom.util.layer,
    }),
    tint: (th) => ({
        backgroundColor: alpha(th.custom.background.bodyColor, 0.7),
        mixBlendMode: th.palette.mode === "dark" ? "multiply" : "screen",
        ...th.custom.util.layer,
    }),
    backPaper: (th) => ({
        backgroundColor: th.palette.background.paper,
        ...th.custom.util.layer,
    }),
});




/**
 * Image background with fallback gradients and filters.
 */
const HeroBack: FC<{
    children: ReactNode;
    withTint?: boolean;
    width?: string;
    height?: string;
    omitBackpaper?: boolean;
}> = ({ children, withTint, width, height, omitBackpaper }) => {
    const sx = useStyles(
        createStyles,
        withTint ? "saturate(0.90)" : undefined,
    );

    const inIframe = useInIframe();
    const isMobile = useIsMobile();

    return (
        <Box
            sx={[sx.heroContainer, {
                width: width ?? "100%",
                height: height ?? "100%",
            }]}
        >
            { (toBool(omitBackpaper) || !inIframe) && (
                <>
                    <Box sx={sx.blackBack} />
                    <GradientLayer start="#00193d" end="#00000000" angle="45deg" />
                    <GradientLayer start="#04619F" end="#00000000" angle="180deg" />
                    <Box sx={sx.heroImage} />
                    { withTint ? ( <Box sx={sx.tint} /> ) : null }
                </>
            ) }
            { !omitBackpaper && isMobile && (<Box sx={sx.backPaper} />) }
            <Box sx={(th) => th.custom.util.layer}>
                { children }
            </Box>
        </Box>
    );
};

export default HeroBack;
