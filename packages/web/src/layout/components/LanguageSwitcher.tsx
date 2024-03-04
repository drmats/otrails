/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { type FC, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";

import { useThunkDispatch } from "~web/store/hooks";
import { selectThemeLanguage } from "~web/layout/selectors";
import { ThemeLanguage } from "~common/framework/language";
import { changeClientThemeLanguage } from "~web/layout/thunks";




/**
 * Visual language switcher.
 *
 * If no props are passsed, then it handles frontend
 * and currently-logged-in user language setting.
 *
 * If props are passed, then it's not dispatching any actions/thunks
 * but just displays selected `language` and calls `onLanguageChange`.
 */
const LanguageSwitcher: FC<{
    language?: ThemeLanguage;
    onLanguageChange?: (language: ThemeLanguage) => void;
}> = ({
    language: inLanguage,
    onLanguageChange: inOnLanguageChange,
}) => {
    const dispatch = useThunkDispatch();
    const { t } = useTranslation();

    const clientLanguage = useSelector(selectThemeLanguage);

    const language = useMemo(
        () => inLanguage ?? clientLanguage,
        [inLanguage, clientLanguage],
    );

    const selectedLanguage = useCallback(
        (tl: ThemeLanguage) => tl === language ? "contained" : "outlined",
        [language],
    );

    const handleChangeLanguage = useCallback(
        (themeLanguage: ThemeLanguage) => () =>
            inOnLanguageChange
                ? inOnLanguageChange(themeLanguage)
                : void dispatch(changeClientThemeLanguage(
                    themeLanguage, { updateUserLanguage: true },
                )),
        [inOnLanguageChange],
    );

    return (
        <ButtonGroup>
            { Object.values(ThemeLanguage).map((tl) => (
                <Tooltip key={tl} title={t(`Common:language_${tl}`)}>
                    <Button
                        disableElevation
                        onClick={handleChangeLanguage(tl)}
                        size="small"
                        variant={selectedLanguage(tl)}
                    >
                        { tl }
                    </Button>
                </Tooltip>
            )) }
        </ButtonGroup>
    );
};

export default LanguageSwitcher;
