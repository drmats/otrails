/**
 * Root redux logic - hydration overrides.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { DeepPartial } from "~common/lib/type";
import type { RootState } from "~web/store/types";
import appInitState from "~web/app/state";
import mapInitState from "~web/map/state";
import routerInitState from "~web/router/state";




/**
 * Redux state hydration overrides.
 */
export const overrides: DeepPartial<RootState> = {

    app: {
        error: undefined,
        state: appInitState.state,
    },

    layout: {
        inIframe: false,
        loading: false,
        themeLanguage: undefined,
    },

    map: {
        ready: false,
        tilesource: mapInitState.tilesource,
    },

    network: {
        connections: 0,
    },

    router: {
        tree: routerInitState.tree,
    },

} as const;
