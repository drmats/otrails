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
import {
    selectMapReady,
    selectTileSources,
    selectTileSourceIndex,
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
export const TileSourceSelect: FC = () => {
    const { t } = useTranslation();
    const sx = useStyles(createStyles);

    const mapReady = useSelector(selectMapReady);
    const tileSources = useSelector(selectTileSources);
    const tileSourceIndex = useSelector(selectTileSourceIndex);

    const handleChange = useCallback((e: SelectChangeEvent) => {
        if (isNumber(e.target.value)) {
            void tnk.map.setTileSourceIndex(e.target.value);
        }
    }, []);

    return (
        <FormControl sx={sx.formControl} size="small">
            <InputLabel>{ t("TileSource:label") }</InputLabel>
            <Select
                label={t("TileSource:label")}
                value={String(tileSourceIndex)}
                onChange={handleChange}
                size="small"
                disabled={!mapReady}
            >
                { tileSources.map((ts, i) => (
                    <MenuItem key={`${ts.label}-${i}`} value={i}>
                        { t(`TileSource:l_${ts.label}`) }
                    </MenuItem>
                )) }
            </Select>
        </FormControl>
    );
};
