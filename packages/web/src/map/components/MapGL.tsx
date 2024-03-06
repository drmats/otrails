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
    useRef,
} from "react";
import { useSelector } from "react-redux";
import type { MapLibreEvent } from "maplibre-gl";
import ReactMapGL, {
    type MapRef,
    type ViewStateChangeEvent,
} from "react-map-gl/maplibre";

import {
    selectTileSource,
    selectViewport,
} from "~web/map/selectors";
import { appMemory } from "~web/root/memory";
import MapContent from "~web/map/components/MapContent";

import "maplibre-gl/dist/maplibre-gl.css";




/**
 * ...
 */
const { act, mut } = appMemory();




/**
 * ...
 */
const MapGL: FC = () => {

    // ...
    const mapRef = useRef<MapRef | null>(null);
    const viewport = useSelector(selectViewport);
    const { url: mapStyle } = useSelector(selectTileSource);

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
    useEffect(() => {
        return () => {
            act.map.SET_READY(false);
            delete mut.map;
        };
    }, [mapRef]);

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
