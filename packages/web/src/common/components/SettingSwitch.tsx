/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import {
    type ChangeEvent,
    type ComponentProps,
    type FC,
    type ReactNode,
    useCallback,
    useState,
} from "react";
import { isString } from "@xcmats/js-toolbox/type";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";

import type { StyleOverrides } from "~web/common/types";
import { sxStyles } from "~web/common/utils";
import Heading from "~web/common/components/Heading";
import { WithTransitions } from "~web/layout/components/ThemeProvider";




/**
 * ...
 */
const sx = sxStyles({
    container: (th) => ({
        padding: th.spacing(2),
    }),
    labelContainer: {},
    formControlLabel: {
        margin: 0,
        ml: 0,
        width: "100%",
        justifyContent: "space-between",
    },
    caption: (th) => ({
        mt: 1,
        color: th.palette.text.secondary,
        userSelect: "none",
    }),
    disabled: (th) => ({
        color: th.palette.text.disabled,
    }),
});




/**
 * Controlled setting switch with icon, title and caption.
 */
const SettingSwitch: FC<{
    state: boolean;
    onStateChange: (state: boolean) => Promise<void> | void;
    label: string;
    icon?: JSX.Element;
    caption?: string | null;
    disabled?: boolean;
    overrides?: StyleOverrides<keyof typeof sx>;
    headingVariant?: ComponentProps<typeof Typography>["variant"];
    children?: ReactNode;
}> = ({
    state,
    onStateChange,
    label,
    icon,
    caption,
    disabled,
    overrides,
    headingVariant,
    children,
}) => {
    const [changeProgress, setChangeProgress] = useState(false);
    const handleChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            setChangeProgress(true);
            try { await onStateChange(e.target.checked); }
            catch { /* no-op */ }
            setChangeProgress(false);
        },
        [onStateChange],
    );

    return (
        <Box sx={[sx.container, overrides?.container ?? {}]}>
            <WithTransitions>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={state}
                            onChange={handleChange}
                        />
                    }
                    disabled={disabled ?? changeProgress}
                    label={
                        <Heading
                            icon={icon}
                            label={label}
                            disabled={disabled}
                            variant={headingVariant}
                            overrides={{
                                headingContainer: overrides?.labelContainer,
                                disabled: overrides?.disabled,
                            }}
                        />
                    }
                    labelPlacement="start"
                    sx={[
                        sx.formControlLabel,
                        overrides?.formControlLabel ?? {},
                    ]}
                />
            </WithTransitions>
            { isString(caption) && (
                <Typography
                    variant="body2"
                    sx={[
                        sx.caption,
                        overrides?.caption ?? {},
                        disabled ? sx.disabled : {},
                        disabled ? overrides?.disabled ?? {} : {},
                    ]}
                >
                    { caption }
                </Typography>
            ) }
            { children }
        </Box>
    );
};

export default SettingSwitch;
