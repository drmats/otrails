/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { timeUnit } from "@xcmats/js-toolbox/utils";




/**
 * In basic SPA routing `route` component comes after `#` in browser's URL.
 * Hash emulation comes after below-defined character.
 */
export const SPA_HASH_SEPARATOR = "@";




/**
 * Event throttling.
 */
export const SPA_HASH_UPDATE_TRESHOLD = 0.25 * timeUnit.second;
