/**
 * Wrapped ReactMapGL component.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import {
    memo,
    type FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useSelector } from "react-redux";
import type {
    LayerSpecification,
    LngLat,
    MapGeoJSONFeature,
    MapLibreEvent,
    Point,
    StyleSpecification,
} from "maplibre-gl";
import ReactMapGL, {
    type MapLayerMouseEvent,
    type MapRef,
    type ViewStateChangeEvent,
} from "react-map-gl/maplibre";

import { substitute } from "~common/framework/routing";
import {
    selectRawMapStyleSource,
    selectTerrainEnabled,
    selectViewport,
} from "~web/map/selectors";
import { selectBackendLocation } from "~web/network/selectors";
import { appMemory } from "~web/root/memory";
import { ACTION } from "~common/app/api";
import { enableTerrain, mergeMapStyles } from "~web/map/lib";
import MapContent from "~web/map/components/MapContent";

import "maplibre-gl/dist/maplibre-gl.css";




/**
 * ...
 */
const { act, mut, tnk } = appMemory();




/**
 * ...
 */
const MapGL: FC = memo(() => {

    // map reference and viewport status
    const mapRef = useRef<MapRef | null>(null);
    const viewport = useSelector(selectViewport);


    // interactive layers
    const [interactiveLayers, setInteractiveLayers] = useState<string[]>([]);


    // otrails tracks
    const [trackStyle, setTrackStyle] =
        useState<StyleSpecification | undefined>(undefined);
    const getTrackStyle = useCallback(async () => {
        const trackStyle = await tnk.map.getTrackStyle();
        setTrackStyle(trackStyle);
        setInteractiveLayers(
            (trackStyle.layers as (
                LayerSpecification & { interactive: boolean }
            )[])
                .filter(({ interactive }) => interactive)
                .map(({ id }) => id),
        );
    }, []);


    // base map
    const {
        url: baseStyleSource,
        themeVariant,
    } = useSelector(selectRawMapStyleSource);
    const [baseMapStyle, setBaseMapStyle] =
        useState<StyleSpecification | undefined>(undefined);
    const getBaseStyle = useCallback(async () => {
        try {
            setBaseMapStyle(
                baseStyleSource.startsWith("/")
                    ? await tnk.network.jsonRequest(
                        baseStyleSource,
                    ) as StyleSpecification
                    : await tnk.network.proxiedRequest({
                        url: baseStyleSource,
                    }) as StyleSpecification,
            );
        } catch {
            setBaseMapStyle(undefined);
        }
    }, [baseStyleSource]);
    useEffect(() => {
        void getBaseStyle().then(() => {
            act.layout.SET_THEME(themeVariant);
        });
    }, [getBaseStyle, themeVariant]);


    // merged map (tracks over base map)
    const mergedMapStyle = useMemo<StyleSpecification | undefined>(() => {
        if (baseMapStyle && trackStyle) {
            return mergeMapStyles(baseMapStyle, trackStyle);
        }
        if (trackStyle) return trackStyle;
        return undefined;
    }, [baseMapStyle, trackStyle]);


    // final map style (with terrain)
    const backendLocation = useSelector(selectBackendLocation);
    const terrainEnabled = useSelector(selectTerrainEnabled);
    const presentationMapStyle = useMemo<StyleSpecification | undefined>(() => {
        if (mergedMapStyle) {
            if (terrainEnabled) {
                return enableTerrain(
                    mergedMapStyle, [
                        backendLocation,
                        substitute(
                            ACTION.tileGetPng,
                            {
                                name: "open-data-elevation-tiles.raster-dem",
                                x: "{x}", y: "{y}", z: "{z}",
                            },
                        ),
                    ].join(""),
                );
            }
            return mergedMapStyle;
        }
        return undefined;
    }, [backendLocation, terrainEnabled, mergedMapStyle]);


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


    // ...
    const onMapClick = useCallback((e: MapLayerMouseEvent) => {
        mut.selection = {
            point: e.point,
            lngLat: e.lngLat,
            features: e.features,
        };
        act.map.SET_SELECTION({
            point: [e.point.x, e.point.y],
            lngLat: [e.lngLat.lng, e.lngLat.lat],
            features: e.features
                ? e.features.map(
                    (f) => ({ id: f.id, properties: f.properties }),
                )
                : [],
            timestamp: Date.now(),
        });
    }, []);


    return (
        <ReactMapGL
            attributionControl={false}
            interactiveLayerIds={interactiveLayers}
            mapStyle={presentationMapStyle}
            maxPitch={85}
            maxZoom={22}
            minPitch={0}
            minZoom={1}
            onClick={onMapClick}
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

});

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
        selection?: {
            point: Point;
            lngLat: LngLat;
            features?: MapGeoJSONFeature[];
        };
    }

}
