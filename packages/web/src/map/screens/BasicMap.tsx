/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FC } from "react";
import { useTranslation } from "react-i18next";

import MapGL from "~web/map/components/MapGL";
import { useDocumentTitle, useStyles } from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";
import MobilePaper from "~web/common/components/MobilePaper";
import { TileSourceSelect } from "~web/map/components/TileSourceSelect";




/**
 * ...
 */
const createStyles = () => sxStyles({
    controlSurface: {
        position: "fixed",
        right: "10px",
        bottom: "10px",
    },
});




/**
 * ...
 */
const BasicMap: FC = () => {
    const { t } = useTranslation();
    const sx = useStyles(createStyles);

    useDocumentTitle(t("BasicMap:title"), true);

    return (
        <>
            <MapGL />
            <MobilePaper sx={sx.controlSurface}>
                <TileSourceSelect />
            </MobilePaper>
        </>
    );
};

export default BasicMap;
