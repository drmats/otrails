/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import {
    DEFAULT_BACKEND_PATH_PREFIX,
    DEFAULT_BACKEND_URL,
} from "~web/network/constants";




/**
 * Network initial state.
 */
export default {

    // how many requests are currently in flight?
    connections: 0,

    // where is backend?
    backendUrl: DEFAULT_BACKEND_URL,

    // what is the path prefix?
    pathPrefix: DEFAULT_BACKEND_PATH_PREFIX,

    // forced refresh mechanism
    refreshTick: 1,

};
