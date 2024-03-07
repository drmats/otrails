/**
 * Wrapped ReactMapGL component.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import {
    type FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useSelector } from "react-redux";
import type { MapLibreEvent, StyleSpecification } from "maplibre-gl";
import ReactMapGL, {
    type MapRef,
    type ViewStateChangeEvent,
} from "react-map-gl/maplibre";

import { ACTION } from "~common/app/api";
import {
    selectRawTileSource,
    selectViewport,
} from "~web/map/selectors";
import { appMemory } from "~web/root/memory";
import { mergeMapStyles } from "~web/map/lib";
import MapContent from "~web/map/components/MapContent";

import "maplibre-gl/dist/maplibre-gl.css";




/**
 * ...
 */
const { act, mut, tnk } = appMemory();




/**
 * ...
 */
const MapGL: FC = () => {

    // map reference and viewport status
    const mapRef = useRef<MapRef | null>(null);
    const viewport = useSelector(selectViewport);


    // otrails tracks
    const [trackStyle, setTrackStyle] =
        useState<StyleSpecification | undefined>(undefined);
    const getTrackStyle = useCallback(async () => {
        setTrackStyle(
            await tnk.network.jsonRequest(
                ACTION.trackStyle,
            ) as StyleSpecification,
        );
    }, []);


    // base map
    const {
        url: baseStyleSource,
        themeVariant,
    } = useSelector(selectRawTileSource);
    const [baseStyle, setBaseStyle] =
        useState<StyleSpecification | undefined>(undefined);
    const getBaseStyle = useCallback(async () => {
        try {
            setBaseStyle(
                baseStyleSource.startsWith("/")
                    ? await tnk.network.jsonRequest(
                        baseStyleSource,
                    ) as StyleSpecification
                    : await tnk.network.proxiedRequest({
                        url: baseStyleSource,
                    }) as StyleSpecification,
            );
        } catch {
            setBaseStyle(undefined);
        }
    }, [baseStyleSource]);
    useEffect(() => {
        void getBaseStyle().then(() => {
            act.layout.SET_THEME(themeVariant);
        });
    }, [getBaseStyle, themeVariant]);


    // merged map (tracks over base map)
    const mapStyle = useMemo<StyleSpecification | undefined>(() => {
        if (baseStyle && trackStyle) {
            return mergeMapStyles(baseStyle, trackStyle);
        }
        if (trackStyle) return trackStyle;
        return undefined;
    }, [baseStyle, trackStyle]);


    // initialize / destroy
    useEffect(() => {
        void getTrackStyle();
        return () => {
            act.map.SET_READY(false);
            delete mut.map;
            void tnk.layout.syncTheme();
        };
    }, [getTrackStyle, mapRef]);


    // ...
    const onMapLoad = useCallback(() => {
        if (mapRef.current) {
            mut.map = mapRef.current;
            act.map.SET_DIMENSIONS(mapRef.current.getCanvas());
        }
        act.map.SET_READY(true);
    }, [mapRef]);


    // ...
    const onMapMove = useCallback((e: ViewStateChangeEvent) => {
        act.map.SET_VIEWPORT(e.viewState);
    }, []);


    // ...
    const onMapResize = useCallback((e: MapLibreEvent) => {
        act.map.SET_DIMENSIONS(e.target.getCanvas());
    }, []);


    return (
        <ReactMapGL
            attributionControl={false}
            {...{
                mapStyle,
                minZoom: 1,
                maxZoom: 22,
            }}
            onLoad={onMapLoad}
            onMove={onMapMove}
            onResize={onMapResize}
            ref={mapRef}
            reuseMaps
            style={{ width: "100vw", height: "100vh" }}
            {...viewport}
        >
            <MapContent />
        </ReactMapGL>
    );

};

export default MapGL;




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Augmenting mutable subcontext.
     */
    interface Mut {
        map?: MapRef;
    }

}
