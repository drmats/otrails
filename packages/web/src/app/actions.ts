/**
 * App component action types and creators.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { actionCreators } from "red-g";




/**
 * App component action types.
 */
export enum AppActionType {

    RESET = "App/RESET",

    READY = "App/READY",
    INITIALIZING = "App/INITIALIZING",
    NOT_READY = "App/NOT_READY",

    VISIBLE = "App/VISIBLE",
    HIDDEN = "App/HIDDEN",

    DEVMODE_ENABLE = "App/DEVMODE_ENABLE",
    DEVMODE_DISABLE = "App/DEVMODE_DISABLE",

    SET_TOPBAR_TITLE = "App/SET_TOPBAR_TITLE",

    CLEAR_ERROR = "App/CLEAR_ERROR",

}




/**
 * App component action creators.
 */
export default actionCreators(AppActionType, {

    NOT_READY: (error?: string) => ({ error }),

    SET_TOPBAR_TITLE: (title: string) => ({ title }),

});
