/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import { memo, type FC, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Fab from "@mui/material/Fab";
import IconMenu from "@mui/icons-material/Menu";
import Zoom from "@mui/material/Zoom";

import { appMemory } from "~web/root/memory";
import { selectReady } from "~web/app/selectors";
import { useSpaRoute } from "~web/router/hooks";
import { selectBottomDrawerOpen, selectLoading } from "~web/layout/selectors";
import { SCREEN } from "~common/app/api";
import { sxStyles } from "~web/common/utils";
import { useInIframe, useStyles } from "~web/layout/hooks";
import { WithTransitions } from "~web/layout/components/ThemeProvider";




/**
 * ...
 */
const createStyles = () => sxStyles({
    fab: (th) => ({
        position: "fixed",
        [th.breakpoints.down("md")]: {
            bottom: th.spacing(2),
            right: th.spacing(2),
        },
        [th.breakpoints.up("md")]: {
            bottom: th.spacing(3),
            right: th.spacing(3),
        },
    }),
});




/**
 * ...
 */
const { act, store } = appMemory();




/**
 * Show menu fab only on selected screens.
 */
const MenuFab: FC = memo(() => {
    const route = useSpaRoute();
    const sx = useStyles(createStyles);


    const appReady = useSelector(selectReady);
    const componentLoading = useSelector(selectLoading);
    const inIframe = useInIframe();


    const showFab = useMemo(() => {
        return (
            !inIframe && appReady && !componentLoading &&
            route.matched !== SCREEN.landing
        );
    }, [
        appReady,
        componentLoading,
        inIframe,
        route.matched,
    ]);


    useEffect(() => {
        if (!showFab && selectBottomDrawerOpen(store.getState())) {
            act.layout.SET_BOTTOM_DRAWER_OPEN(false);
        }
    }, [showFab]);


    return (
        <WithTransitions>
            <Zoom in={showFab}>
                <Fab
                    color="primary"
                    onClick={() => { act.layout.SET_BOTTOM_DRAWER_OPEN(true); }}
                    size="small"
                    sx={sx.fab}
                >
                    <IconMenu fontSize="small" />
                </Fab>
            </Zoom>
        </WithTransitions>
    );
});

export default MenuFab;
