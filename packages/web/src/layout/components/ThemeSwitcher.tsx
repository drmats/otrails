/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { type FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconThemeAuto from "@mui/icons-material/BrightnessMedium";
import IconThemeDark from "@mui/icons-material/NightlightOutlined";
import IconThemeLight from "@mui/icons-material/LightMode";
import Tooltip from "@mui/material/Tooltip";

import { useThunkDispatch } from "~web/store/hooks";
import { selectThemePreference } from "~web/layout/selectors";
import { ThemePreference } from "~common/framework/theme";
import {
    changeThemePreference,
    syncTheme,
} from "~web/layout/thunks";




/**
 * Visual theme switcher.
 */
const ThemeSwitcher: FC = () => {
    const dispatch = useThunkDispatch();
    const { t } = useTranslation();

    const preference = useSelector(selectThemePreference);

    const selected = useCallback(
        (tp: ThemePreference) => preference === tp ? "contained" : "outlined",
        [preference],
    );

    const changeTheme = useCallback(
        (tp: ThemePreference) => async () => {
            await dispatch(changeThemePreference(tp));
            await dispatch(syncTheme());
        },
        [],
    );

    return (
        <ButtonGroup>
            <Tooltip title={t("Common:theme_light")}>
                <Button
                    disableElevation
                    onClick={changeTheme(ThemePreference.LIGHT)}
                    size="small"
                    variant={selected(ThemePreference.LIGHT)}
                >
                    <IconThemeLight />
                </Button>
            </Tooltip>
            <Tooltip title={t("Common:theme_auto")}>
                <Button
                    disableElevation
                    onClick={changeTheme(ThemePreference.SYSTEM)}
                    size="small"
                    variant={selected(ThemePreference.SYSTEM)}
                >
                    <IconThemeAuto />
                </Button>
            </Tooltip>
            <Tooltip title={t("Common:theme_dark")}>
                <Button
                    disableElevation
                    onClick={changeTheme(ThemePreference.DARK)}
                    size="small"
                    variant={selected(ThemePreference.DARK)}
                >
                    <IconThemeDark />
                </Button>
            </Tooltip>
        </ButtonGroup>
    );
};

export default ThemeSwitcher;
