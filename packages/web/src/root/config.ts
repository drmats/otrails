/**
 * Frontend environment settings.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { timeUnit } from "@xcmats/js-toolbox/utils";

import packageJson from "~web/../package.json";




/**
 * Development namespace key.
 */
export const DEV_NAMESPACE_KEY = "cc";




/**
 * Root element id (HTML).
 */
export const ROOT_ELEMENT_ID = "main-app-root";




/**
 * Session storage key.
 */
export const SS_KEY = `${packageJson.name}-${packageJson.version}`;




/**
 * Session Storage save throttling time.
 */
export const SS_SAVE_THROTTLING_TIME = timeUnit.second;




/**
 * Used local storage keys.
 */
export enum StorageKey {
    LANGUAGE = "language",
    SESSION = "session",
    THEME_PREFERENCE = "themePreference",
}
