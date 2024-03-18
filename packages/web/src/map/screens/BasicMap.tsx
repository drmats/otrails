/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FC } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";

import MapGL from "~web/map/components/MapGL";
import { selectMapInspectVisible } from "~web/layout/selectors";
import { useAddressBarInteraction } from "~web/map/hooks";
import {
    useDimensions,
    useDocumentTitle,
    useIsMobile,
    useStyles,
} from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";
import MobilePaper from "~web/common/components/MobilePaper";
import { MapInspect } from "~web/map/components/MapInspect";




/**
 * ...
 */
const createStyles = (isMobile: boolean, width: number) => sxStyles({
    mapInspectSurface: {
        position: "fixed",
        right: isMobile ? "0px" : "10px",
        top: isMobile ? "0px" : "10px",
        width: isMobile ? "100%" : "auto",
        minWidth: "220px",
        maxWidth:
            isMobile
                ? "100%"
                : width >= 420 ? "420px" : `${width}px`,
        maxHeight: isMobile ? "40%" : "640px",
        overflow: "hidden",
        "& > *": {
            m: 1,
            width: "calc(100% - 16px)",
            maxHeight: "calc(640px - 16px)",
            overflowX: "hidden",
            overflowY: "auto",
        },
    },
});




/**
 * ...
 */
const BasicMap: FC = () => {
    const { t } = useTranslation();
    const { width } = useDimensions();
    const isMobile = useIsMobile();
    const sx = useStyles(createStyles, isMobile, width);

    useAddressBarInteraction();
    useDocumentTitle(t("BasicMap:title"), true);

    const mapInspectVisible = useSelector(selectMapInspectVisible);

    return (
        <>
            <MapGL />
            { mapInspectVisible && (
                <MobilePaper sx={sx.mapInspectSurface}>
                    <Box><MapInspect /></Box>
                </MobilePaper>
            ) }
        </>
    );
};

export default BasicMap;
