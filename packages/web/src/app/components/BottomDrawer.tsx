/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconInspect from "@mui/icons-material/Troubleshoot";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { appMemory } from "~web/root/memory";
import { selectReady } from "~web/app/selectors";
import { selectMapSelectionInspectVisible } from "~web/layout/selectors";
import {
    useDimensions,
    useIsMobile,
    useStyles,
} from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";
import { WithTransitions } from "~web/layout/components/ThemeProvider";
import { MapStyleSourceSelect } from "~web/map/components/MapStyleSourceSelect";
import SettingSwitch from "~web/common/components/SettingSwitch";




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
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "4px",
                left: margin,
                right: margin,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            },
        },
        surface: {
            display: "flex",
            flexDirection: "column",
            width: isMobile ? "80%" : "40%",
        },
        switch: { p: 1 },
        formLabel: { alignItems: "flex-end" },
    });
};




/**
 * ...
 */
const { act } = appMemory();




/**
 * Application drawer.
 */
const BottomDrawer: FC<{
    open: boolean;
    onClose: () => void;
    onOpen: () => void;
}> = ({ open, onClose, onOpen }) => {
    const { t } = useTranslation();
    const { width } = useDimensions();
    const isMobile = useIsMobile();
    const sx = useStyles(createStyles, isMobile, width);

    const appReady = useSelector(selectReady);
    const mapSelectionInspectVisible =
        useSelector(selectMapSelectionInspectVisible);

    return appReady && (
        <WithTransitions>
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                sx={sx.drawer}
            >
                <Box sx={[sx.surface, { mt: 1 }]}>
                    <MapStyleSourceSelect />
                </Box>
                <Box sx={sx.surface}>
                    <SettingSwitch
                        icon={<IconInspect />}
                        label={t("Dev:map_selection_inspector")}
                        state={mapSelectionInspectVisible}
                        onStateChange={(s) => {
                            act.layout.SET_MAP_SELECTION_INSPECT_VISIBLE(s);
                        }}
                        overrides={{
                            container: sx.switch,
                            formControlLabel: sx.formLabel,
                        }}
                        headingVariant="body1"
                    />
                </Box>
            </SwipeableDrawer>
        </WithTransitions>
    );
};

export default BottomDrawer;
