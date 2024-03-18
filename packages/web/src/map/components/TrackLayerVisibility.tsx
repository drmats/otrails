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
import IconFlight from "@mui/icons-material/Paragliding";
import IconBike from "@mui/icons-material/DirectionsBike";
import IconRun from "@mui/icons-material/DirectionsRun";
import IconWalk from "@mui/icons-material/DirectionsWalk";
import IconHike from "@mui/icons-material/Hiking";
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
export const TrackLayerVisibility: FC = memo(() => {
    const sx = useStyles(createStyles);
    const lightTheme = useIsThemeLight();
    const colorIndex = useMemo(() => lightTheme ? 0 : 1, [lightTheme]);

    const visibility = useSelector(selectTrackLayersVisibility);

    return (
        <FormControl component="fieldset" sx={sx.formControl}>
            <FormGroup row sx={sx.formGroup}>
                <FormControlLabel
                    name="run"
                    checked={visibility.run}
                    onChange={(_, run) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ run });
                    }}
                    sx={sx.formControlLabel}
                    value="run"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.run[colorIndex])}
                        />
                    }
                    label={
                        <IconRun
                            sx={{ color: TRACK_COLOR.run[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
                <FormControlLabel
                    name="walk"
                    checked={visibility.walk}
                    onChange={(_, walk) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ walk });
                    }}
                    sx={sx.formControlLabel}
                    value="walk"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.walk[colorIndex])}
                        />
                    }
                    label={
                        <IconWalk
                            sx={{ color: TRACK_COLOR.walk[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
                <FormControlLabel
                    name="hike"
                    checked={visibility.hike}
                    onChange={(_, hike) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ hike });
                    }}
                    sx={sx.formControlLabel}
                    value="hike"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.hike[colorIndex])}
                        />
                    }
                    label={
                        <IconHike
                            sx={{ color: TRACK_COLOR.hike[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
                <FormControlLabel
                    name="bike"
                    checked={visibility.bike}
                    onChange={(_, bike) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ bike });
                    }}
                    sx={sx.formControlLabel}
                    value="bike"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.bike[colorIndex])}
                        />
                    }
                    label={
                        <IconBike
                            sx={{ color: TRACK_COLOR.bike[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
                <FormControlLabel
                    name="flight"
                    checked={visibility.flight}
                    onChange={(_, flight) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ flight });
                    }}
                    sx={sx.formControlLabel}
                    value="flight"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.flight[colorIndex])}
                        />
                    }
                    label={
                        <IconFlight
                            sx={{ color: TRACK_COLOR.flight[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
                <FormControlLabel
                    name="water"
                    checked={visibility.water}
                    onChange={(_, water) => {
                        act.map.SET_TRACK_LAYERS_VISIBILITY({ water });
                    }}
                    sx={sx.formControlLabel}
                    value="water"
                    control={
                        <Checkbox
                            size="small"
                            sx={sxColor(TRACK_COLOR.water[colorIndex])}
                        />
                    }
                    label={
                        <IconWater
                            sx={{ color: TRACK_COLOR.water[colorIndex] }}
                        />
                    }
                    labelPlacement="top"
                />
            </FormGroup>
        </FormControl>
    );
});
