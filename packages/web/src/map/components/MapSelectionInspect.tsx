/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { memo, type FC } from "react";
import { useSelector } from "react-redux";

import { selectSelection } from "~web/map/selectors";
import FreeFormInspect from "~web/common/components/FreeFormInspect";
import { timestampToIso } from "~common/lib/time";




/**
 * ...
 */
export const MapSelectionInspect: FC = memo(() => {
    const mapSelection = useSelector(selectSelection);

    return (
        <FreeFormInspect
            overrides={{
                container: { "& > *": { marginLeft: "0 !important" } },
            }}
            data={mapSelection ? {
                point: mapSelection.point.join(", "),
                lngLat: [
                    mapSelection.lngLat[0].toPrecision(8),
                    mapSelection.lngLat[1].toPrecision(8),
                ].join(", "),
                features: mapSelection.features,
                timestamp: timestampToIso(mapSelection.timestamp),
            } : {
                selection: "empty",
            }}
        />
    );
});
