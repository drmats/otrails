/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import type { FC } from "react";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { useDocumentTitle, useHeight, useStyles } from "~web/layout/hooks";
import { commonStyles, outerStyles } from "~web/layout/styles";
import { sxStyles } from "~web/common/utils";
import Centerer from "~web/layout/components/Centerer";
import MobilePaper from "~web/common/components/MobilePaper";
import ThemeSwitcher from "~web/layout/components/ThemeSwitcher";
import LanguageSwitcher from "~web/layout/components/LanguageSwitcher";




/**
 * ...
 */
const createStyles = (height: number) => sxStyles({
    ...outerStyles(height),
    ...commonStyles,
});




/**
 * Landing screen.
 */
const LandingScreen: FC = () => {
    const { t } = useTranslation();
    const height = useHeight();
    const sx = useStyles(createStyles, height);

    useDocumentTitle(t("Landing:landing_title"), true);

    return (
        <Container maxWidth="xs" sx={sx.container}>
            <Box
                sx={[
                    sx.content, sx.mobileContent,
                    { justifyContent: "center" },
                ]}
            >
                <MobilePaper sx={sx.surface}>
                    <Centerer>
                        { t("Landing:hi") }
                    </Centerer>
                </MobilePaper>

                <MobilePaper sx={sx.surface}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="space-around"
                        alignItems="center"
                        gap={1}
                    >
                        <Grid item><LanguageSwitcher /></Grid>
                        <Grid item><ThemeSwitcher /></Grid>
                    </Grid>
                </MobilePaper>
            </Box>
        </Container>
    );
};

export default LandingScreen;
