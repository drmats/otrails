/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FC } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

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
        zIndex: 100,
        right: isMobile ? "0px" : "10px",
        top: isMobile ? "0px" : "10px",
        width: isMobile ? "100%" : "auto",
        minWidth: "220px",
        maxWidth:
            isMobile
                ? "100%"
                : width >= 600 ? "600px" : `${width}px`,
        maxHeight: isMobile ? "40%" : "640px",
        overflowX: "hidden",
        overflowY: "scroll",
        "& > *": {
            m: 1, pr: !isMobile ? 1 : 0,
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
                    <MapInspect />
                </MobilePaper>
            ) }
        </>
    );
};

export default BasicMap;
