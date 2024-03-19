/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { memo, type FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { objectMap } from "@xcmats/js-toolbox/struct";

import { selectSelection, selectViewport } from "~web/map/selectors";
import FreeFormInspect from "~web/common/components/FreeFormInspect";
import { timestampToIso } from "~common/lib/time";




/**
 * ...
 */
export const MapInspect: FC = memo(() => {
    const mapSelection = useSelector(selectSelection);
    const mapViewport = useSelector(selectViewport);
    const truncMapViewport = useMemo(
        () => objectMap(mapViewport) (([k, v]) => [k, v.toFixed(6)]),
        [mapViewport],
    );

    return (
        <FreeFormInspect
            overrides={{
                container: {
                    "& > *": {
                        marginLeft: "0 !important",
                    },
                },
            }}
            data={mapSelection ? {
                ...truncMapViewport,
                selection: {
                    point: mapSelection.point.join(", "),
                    lngLat: [
                        mapSelection.lngLat[0].toFixed(6),
                        mapSelection.lngLat[1].toFixed(6),
                    ].join(", "),
                    features: mapSelection.features,
                    timestamp: timestampToIso(mapSelection.timestamp),
                },
            } : {
                ...truncMapViewport,
                selection: "empty",
            }}
        />
    );
});
