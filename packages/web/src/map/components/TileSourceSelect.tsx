/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { type FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { isNumber } from "@xcmats/js-toolbox/type";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { appMemory } from "~web/root/memory";
import { tileSources } from "~web/map/constants";
import { selectMapReady, selectTileSourceIndex } from "~web/map/selectors";
import { useStyles } from "~web/layout/hooks";
import { sxStyles } from "~web/common/utils";




/**
 * ...
 */
const { act } = appMemory();




/**
 * ...
 */
const createStyles = () => sxStyles({
    formControl: { m: 1, minWidth: 220 },
});




/**
 * ...
 */
export const TileSourceSelect: FC = () => {
    const { t } = useTranslation();
    const sx = useStyles(createStyles);

    const mapReady = useSelector(selectMapReady);
    const tileSourceIndex = useSelector(selectTileSourceIndex);

    const handleChange = useCallback((e: SelectChangeEvent) => {
        if (isNumber(e.target.value))
            act.map.SET_TILESOURCE_INDEX(e.target.value);
    }, []);

    return mapReady ? (
        <FormControl sx={sx.formControl} size="small">
            <InputLabel>{ t("TileSourceSelect:label") }</InputLabel>
            <Select
                label={t("TileSourceSelect:label")}
                value={String(tileSourceIndex)}
                onChange={handleChange}
                size="small"
            >
                { tileSources.map((ts, i) => (
                    <MenuItem key={`${ts.label}-${i}`} value={i}>
                        { ts.label }
                    </MenuItem>
                )) }
            </Select>
        </FormControl>
    ) : null;
};
