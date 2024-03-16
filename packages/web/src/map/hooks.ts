/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import { appMemory } from "~web/root/memory";
import { useSpaNavigation } from "~web/router/hooks";
import {
    selectMaxMapStyleSourceIndex,
    selectMapStyleSourceIndex,
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




/**
 * ...
 */
const { store, tnk } = appMemory();




/**
 * Map <-> address bar interaction.
 */
export const useAddressBarInteraction = (): void => {

    const navigate = useSpaNavigation();

    // ...
    const inQueryChange = useSelector(selectIncomingBrowserHashChange);
    const viewport = useSelector(selectViewport);
    const settingViewportProgress = useRef(false);
    const mapStyleSourceIndex = useSelector(selectMapStyleSourceIndex);
    const settingMapStyleSourceIndexProgress = useRef(false);


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
            inQuery.m <= selectMaxMapStyleSourceIndex(state)
        ) {
            void tnk.map.setMapStyleSourceIndex(
                inQuery.m,
                (state) => { settingMapStyleSourceIndexProgress.current = state; },
            );
        } else {
            navigate.replaceQuery((c) => ({
                ...c, m: selectMapStyleSourceIndex(state),
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
        if (!settingMapStyleSourceIndexProgress.current) {
            throttledTileSourceIndexHashUpdate(
                (m) => navigate.replaceQuery((c) => ({ ...c, m })),
                mapStyleSourceIndex,
            );
        }
    }, [mapStyleSourceIndex]);

};
