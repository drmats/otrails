/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";




/**
 * Network action types.
 */
export enum NetworkActionType {

    RESET = "Network/RESET",

    SET_BACKEND_URL = "Network/SET_BACKEND_URL",
    SET_PATH_PREFIX = "Network/SET_PATH_PREFIX",

    START_REQUEST = "Network/START_REQUEST",
    FINISH_REQUEST = "Network/FINISH_REQUEST",

    REFRESH = "Network/REFRESH",
}




/**
 * Network action creators.
 */
export default actionCreators(NetworkActionType, {

    SET_BACKEND_URL: (backendUrl: string) => ({ backendUrl }),
    SET_PATH_PREFIX: (pathPrefix: string) => ({ pathPrefix }),

});
