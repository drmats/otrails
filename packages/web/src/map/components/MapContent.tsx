/**
 * Map contents.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { memo, type CSSProperties, type FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { ScaleControl } from "react-map-gl/maplibre";

import { useIsThemeLight } from "~web/layout/hooks";
import { selectTrackLayersVisibility } from "~web/map/selectors";
import TrackLayer from "~web/map/components/TrackLayer";




/**
 * Sources, layers, components, etc.
 */
const MapContent: FC = memo(() => {
    const lightTheme = useIsThemeLight();
    const scaleStyle = useMemo<CSSProperties>(
        () => ({
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            borderWidth: "2px",
            fontFamily: "Roboto",
            fontSize: "12px",
            fontWeight: 500,
            ...lightTheme
                ? {
                    backgroundColor: "#f5f5f588",
                    borderColor: "#131313ee",
                    color: "#131313ee",
                    boxShadow: "0px 0px 5px white",
                }
                : {
                    backgroundColor: "#13131388",
                    borderColor: "#f5f5f5ee",
                    color: "#f5f5f5ee",
                    boxShadow: "0px 0px 5px black",
                },
        }),
        [lightTheme],
    );

    const visibility = useSelector(selectTrackLayersVisibility);

    return (
        <>
            <ScaleControl
                position="top-left"
                unit="metric"
                style={scaleStyle}
            />
            <TrackLayer type="flight" visible={visibility.flight} />
            <TrackLayer type="bike" visible={visibility.bike} />
            <TrackLayer type="run" visible={visibility.run} />
            <TrackLayer type="walk" visible={visibility.walk} />
            <TrackLayer type="hike" visible={visibility.hike} />
            <TrackLayer type="water" visible={visibility.water} />
        </>
    );
});

export default MapContent;
