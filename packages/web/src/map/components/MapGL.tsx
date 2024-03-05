/**
 * Wrapped ReactMapGL component.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import {
    type FC,
    useCallback,
    useRef,
    useState,
} from "react";
import { useSelector } from "react-redux";
import ReactMapGL, {
    type MapRef,
    type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import { selectBackendLocation } from "~web/network/selectors";

import "maplibre-gl/dist/maplibre-gl.css";




/**
 * ...
 */
const MapGL: FC = () => {

    const backendLocation = useSelector(selectBackendLocation);

    const mapRef = useRef<MapRef | null>(null);
    const [viewport, setViewport] = useState({
        bearing: 0,
        latitude: 52.06,
        longitude: 19.85,
        pitch: 0,
        zoom: 5,
    });

    const onMapMove = useCallback((e: ViewStateChangeEvent) => {
        setViewport(e.viewState);
    }, []);

    return (
        <ReactMapGL
            attributionControl={false}
            {...{
                mapStyle: `${backendLocation}/map/style.json`,
                minZoom: 1,
                maxZoom: 22,
            }}
            onMove={onMapMove}
            ref={mapRef}
            reuseMaps
            style={{ width: "100vw", height: "100vh" }}
            {...viewport}
        >
            null
        </ReactMapGL>
    );

};

export default MapGL;
