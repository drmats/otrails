/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { type FC, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import MapGL from "~web/map/components/MapGL";
import { appMemory } from "~web/root/memory";
import { useIncomingSpaQuery, useSpaNavigation } from "~web/router/hooks";
import { selectTileSourceIndex, selectViewport } from "~web/map/selectors";
import { useDocumentTitle, useStyles } from "~web/layout/hooks";
import {
    coordsToMapViewport,
    stringToCoords,
    throttledTileSourceIndexHashUpdate,
    throttledViewportHashUpdate,
} from "~web/map/lib";
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
const { act, tnk } = appMemory();




/**
 * ...
 */
const BasicMap: FC = () => {
    const navigate = useSpaNavigation();
    const { t } = useTranslation();
    const sx = useStyles(createStyles);

    useDocumentTitle(t("BasicMap:title"), true);


    // ...
    const inQuery = useIncomingSpaQuery();
    const viewport = useSelector(selectViewport);
    const settingViewportProgress = useRef(false);
    const tileSourceIndex = useSelector(selectTileSourceIndex);


    // handle manual address-bar changes (and initial link-parsing)
    useEffect(() => {
        if (isString(inQuery.p)) {
            try {
                void tnk.map.setViewport(
                    coordsToMapViewport(stringToCoords(inQuery.p)),
                    (state) => { settingViewportProgress.current = state; },
                );
            } catch { /* no-op */ }
        }
        if (isNumber(inQuery.m)) {
            act.map.SET_TILESOURCE_INDEX(inQuery.m);
        }
    }, [inQuery]);

    // reflect map state in address-bar query
    useEffect(() => {
        if (!settingViewportProgress.current) {
            throttledViewportHashUpdate(
                (p) => navigate.replaceQuery((c) => ({ ...c, p })),
                viewport,
            );
        }
    }, [viewport]);

    // reflect base map selection (tile source) in address-bar query
    useEffect(() => {
        throttledTileSourceIndexHashUpdate(
            (m) => navigate.replaceQuery((c) => ({ ...c, m })),
            tileSourceIndex,
        );
    }, [tileSourceIndex]);


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
