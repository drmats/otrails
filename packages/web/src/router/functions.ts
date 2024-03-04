/**
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import { SPA_HASH_SEPARATOR } from "~web/router/constants";




/**
 * Simplest possible SPA routing - split string into two parts.
 */
export const hashToSpaRoute = (hash: string): [string, string] => {
    const [r, h] = hash.split(SPA_HASH_SEPARATOR);
    return [r, h ?? ""];
};




/**
 * Ensure '#' symbol.
 */
export const formatRoute = (route: string): string => `#${route}`;
