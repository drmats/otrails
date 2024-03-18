/**
 * Map contents.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { type CSSProperties, type FC, useMemo } from "react";
import { ScaleControl } from "react-map-gl/maplibre";

import { useIsThemeLight } from "~web/layout/hooks";




/**
 * Sources, layers, components, etc.
 */
const MapContent: FC = () => {
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

    return (
        <ScaleControl
            position="top-left"
            unit="metric"
            style={scaleStyle}
        />
    );
};

export default MapContent;
