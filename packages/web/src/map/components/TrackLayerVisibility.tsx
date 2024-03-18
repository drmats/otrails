/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { memo, type FC, useMemo } from "react";
import { useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import IconBike from "@mui/icons-material/DirectionsBike";
import IconFlight from "@mui/icons-material/Paragliding";
import IconHike from "@mui/icons-material/Hiking";
import IconRun from "@mui/icons-material/DirectionsRun";
import IconWalk from "@mui/icons-material/DirectionsWalk";
import IconWater from "@mui/icons-material/Surfing";


import { appMemory } from "~web/root/memory";
import { selectTrackLayersVisibility } from "~web/map/selectors";
import { useIsThemeLight, useStyles } from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";
import { TRACK_COLOR } from "~common/app/models/track";




/**
 * ...
 */
const { act } = appMemory();




/**
 * ...
 */
const createStyles = () => sxStyles({
    formControl: { m: 1 },
    formGroup: { display: "flex", justifyContent: "space-between" },
    formControlLabel: { marginX: 0 },
});




/**
 * ...
 */
const sxColor = (c: string) => ({
    color: c,
    "&.Mui-checked": { color: c },
});




/**
 * ...
 */
const trackIcons = [
    { type: "run", Icon: IconRun },
    { type: "walk", Icon: IconWalk },
    { type: "hike", Icon: IconHike },
    { type: "bike", Icon: IconBike },
    { type: "flight", Icon: IconFlight },
    { type: "water", Icon: IconWater },
] as const;




/**
 * ...
 */
export const TrackLayerVisibility: FC = memo(() => {
    const sx = useStyles(createStyles);
    const lightTheme = useIsThemeLight();
    const colorIndex = useMemo(() => lightTheme ? 0 : 1, [lightTheme]);

    const visibility = useSelector(selectTrackLayersVisibility);

    return (
        <FormControl component="fieldset" sx={sx.formControl}>
            <FormGroup row sx={sx.formGroup}>
                { trackIcons.map(({ type, Icon }) => (
                    <FormControlLabel
                        key={type}
                        name={type}
                        checked={visibility[type]}
                        onChange={(_, v) => {
                            act.map.SET_TRACK_LAYERS_VISIBILITY({ [type]: v });
                        }}
                        sx={sx.formControlLabel}
                        value={type}
                        control={
                            <Checkbox
                                size="small"
                                sx={sxColor(TRACK_COLOR[type][colorIndex])}
                            />
                        }
                        label={
                            <Icon
                                sx={{ color: TRACK_COLOR[type][colorIndex] }}
                            />
                        }
                        labelPlacement="top"
                    />
                )) }
            </FormGroup>
        </FormControl>
    );
});
