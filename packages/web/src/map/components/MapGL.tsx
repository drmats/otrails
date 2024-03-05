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
    useState,
} from "react";
import { useSelector } from "react-redux";
import ReactMapGL, {
    type MapRef,
    type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { selectBackendLocation } from "~web/network/selectors";
import { appMemory } from "~web/root/memory";
import MapContent from "~web/map/components/MapContent";

import "maplibre-gl/dist/maplibre-gl.css";




/**
 * ...
 */
const { mut } = appMemory();




/**
 * ...
 */
const MapGL: FC = () => {

    const backendLocation = useSelector(selectBackendLocation);

    // ...
    const mapRef = useRef<MapRef | null>(null);
    const [viewport, setViewport] = useState({
        bearing: 0,
        latitude: 52.06,
        longitude: 19.85,
        pitch: 0,
        zoom: 5,
    });

    // ...
    const onMapLoad = useCallback(() => {
        if (mapRef.current) mut.map = mapRef.current;
    }, [mapRef]);

    // ...
    const onMapMove = useCallback((e: ViewStateChangeEvent) => {
        setViewport(e.viewState);
    }, []);

    // ...
    useEffect(() => {
        return () => {
            delete mut.map;
        };
    }, [mapRef]);

    return (
        <ReactMapGL
            attributionControl={false}
            {...{
                mapStyle: `${backendLocation}/map/style.json`,
                minZoom: 1,
                maxZoom: 22,
            }}
            onLoad={onMapLoad}
            onMove={onMapMove}
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
