/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { useEffect, useCallback, type FC } from "react";
import { useTranslation } from "react-i18next";
import { timeUnit } from "@xcmats/js-toolbox/utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconRefresh from "@mui/icons-material/Refresh";
import Typography from "@mui/material/Typography";

import { useSpaNavigation } from "~web/router/hooks";
import { useDocumentTitle } from "~web/layout/hooks";
import Centerer from "~web/layout/components/Centerer";




/**
 * Error screen.
 */
const ErrorScreen: FC<{ message: string; redirect?: string }> = ({
    message, redirect,
}) => {
    const navigate = useSpaNavigation();
    const { t } = useTranslation();

    useDocumentTitle(t(message), true);

    useEffect(() => {
        if (redirect) setTimeout(
            () => { navigate.replace(redirect, { resetHash: true }); },
            timeUnit.second,
        );
    }, [redirect]);

    const refresh = useCallback(() => location.reload(), []);

    return (
        <Centerer>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <Typography variant="h5" color="error">
                    { t(message) }
                </Typography>
                <Button
                    startIcon={<IconRefresh />}
                    variant="outlined"
                    color="warning"
                    size="large"
                    onClick={refresh}
                >
                    { t("Common:refresh") }
                </Button>
            </Box>
        </Centerer>
    );
};

export default ErrorScreen;
