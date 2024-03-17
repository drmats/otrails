/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import IconInspect from "@mui/icons-material/Troubleshoot";
import IconTerrain from "@mui/icons-material/Terrain";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import { appMemory } from "~web/root/memory";
import { selectReady } from "~web/app/selectors";
import { selectMapInspectVisible } from "~web/layout/selectors";
import { selectTerrainEnabled } from "~web/map/selectors";
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
        switch: { p: 0 },
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
    const mapInspectVisible = useSelector(selectMapInspectVisible);
    const terrainEnabled = useSelector(selectTerrainEnabled);

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
                        state={mapInspectVisible}
                        onStateChange={(s) => {
                            act.layout.SET_MAP_INSPECT_VISIBLE(s);
                        }}
                        overrides={{
                            container: sx.switch,
                            formControlLabel: sx.formLabel,
                        }}
                        headingVariant="body1"
                    />
                    <SettingSwitch
                        icon={<IconTerrain />}
                        label={t("Map:terrain")}
                        state={terrainEnabled}
                        onStateChange={(s) => {
                            act.map.SET_TERRAIN_ENABLED(s);
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
