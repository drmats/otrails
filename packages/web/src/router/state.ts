/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { RTree } from "~common/framework/routing";
import type { FreeFormRecord } from "~common/lib/type";
import { makeEmptyRTree } from "~common/framework/routing";




/**
 * Router component initial state.
 */
export default {

    // parametrized routes prefix tree
    tree: makeEmptyRTree() as RTree,

    // url hash (basic SPA routing)
    hash: "",

    // route state (serialized)
    routeState: "",

    // page state persistence cache: raw route -> serialized state
    cache: {} as FreeFormRecord<string>,

};
