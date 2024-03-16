/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { selectReady } from "~web/app/selectors";
import {
    useDimensions,
    useIsMobile,
    useStyles,
} from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";
import { WithTransitions } from "~web/layout/components/ThemeProvider";
import { MapStyleSourceSelect } from "~web/map/components/MapStyleSourceSelect";
import { MapSelectionInspect } from "~web/map/components/MapSelectionInspect";




/**
 * ...
 */
const createStyles = (isMobile: boolean, width: number) => {
    const margin = isMobile
        ? "0px"
        : `${(width - 800) / 2}px`;
    return sxStyles({
        drawer: {
            "& > .MuiPaper-root": {
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
                left: margin,
                right: margin,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            },
        },
        mapStyleSurface: {
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "80%" : "40%",
            marginY: 1,
        },
        mapSelectionSurface: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: isMobile ? "80%" : "60%",
            mb: 1,
        },
    });
};




/**
 * Application drawer.
 */
const BottomDrawer: FC<{
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}> = ({ open, onClose, onOpen }) => {
    const { width } = useDimensions();
    const isMobile = useIsMobile();
    const sx = useStyles(createStyles, isMobile, width);

    const appReady = useSelector(selectReady);

    return appReady && (
        <WithTransitions>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                sx={sx.drawer}
            >
                <Box sx={sx.mapStyleSurface}>
                    <MapStyleSourceSelect />
                </Box>
                <Box sx={sx.mapSelectionSurface}>
                    <MapSelectionInspect />
                </Box>
            </SwipeableDrawer>
        </WithTransitions>
    );
};

export default BottomDrawer;
