/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { memo, type FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isNumber } from "@xcmats/js-toolbox/type";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { appMemory } from "~web/root/memory";
import {
    selectMapReady,
    selectMapStyleSourceIndex,
    selectMapStyleSources,
} from "~web/map/selectors";
import { useStyles } from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";




/**
 * ...
 */
const { tnk } = appMemory();




/**
 * ...
 */
const createStyles = () => sxStyles({
    formControl: { m: 1, minWidth: 220 },
});




/**
 * ...
 */
export const MapStyleSourceSelect: FC = memo(() => {
    const { t } = useTranslation();
    const sx = useStyles(createStyles);

    const mapReady = useSelector(selectMapReady);
    const mapStyleSources = useSelector(selectMapStyleSources);
    const mapStyleSourceIndex = useSelector(selectMapStyleSourceIndex);

    const handleChange = useCallback((e: SelectChangeEvent) => {
        if (isNumber(e.target.value)) {
            void tnk.map.setMapStyleSourceIndex(e.target.value);
        }
    }, []);

    return (
        <FormControl sx={sx.formControl} size="small">
            <InputLabel>{ t("MapStyleSource:label") }</InputLabel>
            <Select
                label={t("MapStyleSource:label")}
                value={String(mapStyleSourceIndex)}
                onChange={handleChange}
                size="small"
                disabled={!mapReady}
            >
                { mapStyleSources.map((mss, i) => (
                    <MenuItem key={`${mss.label}-${i}`} value={i}>
                        { mss.displayName ?? t(`MapStyleSource:l_${mss.label}`) }
                    </MenuItem>
                )) }
            </Select>
        </FormControl>
    );
});
