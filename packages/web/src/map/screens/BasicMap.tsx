/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { type FC, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isNumber, isString } from "@xcmats/js-toolbox/type";
import Box from "@mui/material/Box";

import MapGL from "~web/map/components/MapGL";
import { appMemory } from "~web/root/memory";
import { useSpaNavigation } from "~web/router/hooks";
import {
    useDimensions,
    useDocumentTitle,
    useIsMobile,
    useStyles,
} from "~web/layout/hooks";
import {
    selectMaxTileSourceIndex,
    selectTileSourceIndex,
    selectViewport,
} from "~web/map/selectors";
import {
    selectIncomingBrowserHashChange,
    selectIncomingSpaQueryMapping,
} from "~web/router/selectors";
import {
    coordsToMapViewport,
    mapViewportToString,
    stringToCoords,
    throttledTileSourceIndexHashUpdate,
    throttledViewportHashUpdate,
} from "~web/map/lib";
import { sxStyles } from "~web/common/utils";
import MobilePaper from "~web/common/components/MobilePaper";
import { TileSourceSelect } from "~web/map/components/TileSourceSelect";
import { MapSelectionInspect } from "~web/map/components/MapSelectionInspect";




/**
 * ...
 */
const createStyles = (isMobile: boolean, width: number) => sxStyles({
    mapSelectionSurface: {
        position: "fixed",
        right: isMobile ? "0px" : "10px",
        top: isMobile ? "0px" : "10px",
        width: isMobile ? "100%" : "auto",
        maxWidth:
            isMobile
                ? "100%"
                : width >= 400 ? "400px" : `${width}px`,
        maxHeight: isMobile ? "40%" : "640px",
        overflow: "hidden",
        "& > *": {
            m: 1,
            width: "calc(100% - 16px)",
            maxHeight: "calc(640px - 16px)",
            overflow: "scroll",
        },
    },
    tileSourceSurface: {
        position: "fixed",
        right: isMobile ? "0px" : "10px",
        bottom: isMobile ? "0px" : "10px",
    },
});




/**
 * ...
 */
const { store, tnk } = appMemory();




/**
 * ...
 */
const BasicMap: FC = () => {
    const navigate = useSpaNavigation();
    const { t } = useTranslation();
    const { width } = useDimensions();
    const isMobile = useIsMobile();
    const sx = useStyles(createStyles, isMobile, width);

    useDocumentTitle(t("BasicMap:title"), true);


    // ...
    const inQueryChange = useSelector(selectIncomingBrowserHashChange);
    const viewport = useSelector(selectViewport);
    const settingViewportProgress = useRef(false);
    const tileSourceIndex = useSelector(selectTileSourceIndex);
    const settingTileSourceIndexProgress = useRef(false);


    // handle manual address-bar changes (and initial link-parsing)
    useEffect(() => {
        const state = store.getState();
        const inQuery = selectIncomingSpaQueryMapping(state);

        let isPositionValid = false;
        if (isString(inQuery.p)) {
            try {
                void tnk.map.setViewport(
                    coordsToMapViewport(stringToCoords(inQuery.p)),
                    (state) => { settingViewportProgress.current = state; },
                );
                isPositionValid = true;
            } catch { /* no-op */ }
        }
        if (!isPositionValid) {
            navigate.replaceQuery((c) => ({
                ...c, p: mapViewportToString(selectViewport(state)),
            }));
        }

        if (
            isNumber(inQuery.m) &&
            inQuery.m >= 0 &&
            inQuery.m <= selectMaxTileSourceIndex(state)
        ) {
            void tnk.map.setTileSourceIndex(
                inQuery.m,
                (state) => { settingTileSourceIndexProgress.current = state; },
            );
        } else {
            navigate.replaceQuery((c) => ({
                ...c, m: selectTileSourceIndex(state),
            }));
        }
    }, [inQueryChange]);


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
        if (!settingTileSourceIndexProgress.current) {
            throttledTileSourceIndexHashUpdate(
                (m) => navigate.replaceQuery((c) => ({ ...c, m })),
                tileSourceIndex,
            );
        }
    }, [tileSourceIndex]);


    return (
        <>
            <MapGL />
            <MobilePaper sx={sx.mapSelectionSurface}>
                <Box><MapSelectionInspect /></Box>
            </MobilePaper>
            <MobilePaper sx={sx.tileSourceSurface}>
                <TileSourceSelect />
            </MobilePaper>
        </>
    );
};

export default BasicMap;
