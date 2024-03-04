/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { ThunkType } from "~web/store/types";
import { dimensions } from "~web/layout/types";




/**
 * Layout-related listeners.
 */
const setupListener: ThunkType<void> = (_d, _getState, { act }) => {

    // handle viewport dimensions change - update redux state
    const setDimensions = () => {
        let htmlDimensions = dimensions(0, 0);
        try {
            const html = document.getElementsByTagName("html").item(0);
            htmlDimensions = dimensions(
                html?.clientWidth ?? 0, html?.clientHeight ?? 0,
            );
        } catch { /* no-op */ }

        act.layout.SET_DIMENSIONS({
            windowInner: dimensions(window.innerWidth, window.innerHeight),
            windowOuter: dimensions(window.outerWidth, window.outerHeight),
            html: htmlDimensions,
        });
    };

    // initial dimensions synchronization
    setDimensions();

    // dimensions synchronization on every size change
    window.addEventListener("resize", () => {
        setDimensions();
    });

};

export default setupListener;
