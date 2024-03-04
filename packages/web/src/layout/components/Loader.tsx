/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { type FC, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { useMemory } from "~web/root/memory";
import Centerer from "~web/layout/components/Centerer";




/**
 * Full-screen loader.
 */
const Loader: FC<{ withAppBar?: boolean }> = ({ withAppBar }) => {
    const { act } = useMemory();

    useEffect(() => {
        act.layout.LOADING();
        return () => { act.layout.LOADED(); };
    }, [act]);

    return (
        <Centerer
            withAppBar={withAppBar}
            innerStyleOverrides={{ overflow: "hidden" }}
        >
            <CircularProgress />
        </Centerer>
    );
};

export default Loader;
