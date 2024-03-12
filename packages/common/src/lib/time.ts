/**
 * Various date/time utilities (using javascript's Date).
 *
 * @module @xcmats/time
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { isDate, isString } from "@xcmats/js-toolbox/type";




/**
 * Convert ISO string ('%Y-%m-%dT%H:%M:%fZ') into a unix epoch timestamp.
 */
export const isoToTimestamp = (iso: string): number => new Date(iso).getTime();




/**
 * Convert unix epoch timestamp to ISO string ('%Y-%m-%dT%H:%M:%fZ').
 */
export const timestampToIso = (ts: number): string => new Date(ts).toJSON();




/**
 * Return ISO 8601 representation of "now".
 */
export const isoNow = (): string => (new Date()).toJSON();




/**
 * Check date validity.
 */
export const isValidDate = (candidate: unknown): candidate is Date =>
    isDate(candidate) && !isNaN(candidate.valueOf());




/**
 * Check if given candidate is a valid ISO 8601 string.
 */
export const isValidDateString = (candidate: unknown): candidate is string =>
    isString(candidate) && candidate === (new Date(candidate)).toJSON();
