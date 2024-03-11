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

    // url hash (SPA routing)
    hash: "",

    // url hash - manual address bar changes / last user input
    incomingHash: "",

    // url hash - timestamp of last user interaction
    incomingHashChange: 0,

    // route state (serialized)
    routeState: "",

    // page state persistence cache: raw route -> serialized state
    cache: {} as FreeFormRecord<string>,

};
