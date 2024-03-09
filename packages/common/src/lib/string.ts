/**
 * String utilities.
 *
 * @module @xcmats/string
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { range } from "@xcmats/js-toolbox/array";




/**
 * `&nbsp;` as unicode.
 */
export const NBSP = "\u00A0";




/**
 * `&ndash;` as unicode.
 */
export const NDASH = "\u2013";




/**
 * Non-breaking hyphen.
 */
export const NBHYP = "\u2011";




/**
 * `&mdash;` as unicode.
 */
export const MDASH = "\u2014";




/**
 * HORIZONTAL BAR as unicode.
 */
export const HBAR = "\u2015";




/**
 * `&bull;` as unicode.
 */
export const BULL = "\u2022";




/**
 * Indent given string (paragraph).
 */
export const indent = (
    input: string,
    opts?: { level?: number; symbol?: string },
): string => {
    const level = opts?.level ?? 4;
    const symbol = opts?.symbol ?? " ";
    const indentation = range(level).map(() => symbol).join("");
    return input.split("\n").map((line) => `${indentation}${line}`).join("\n");
};




/**
 * Format input number as string with desired precision.
 */
export const format = (input: number, precision = 4): string =>
    input.toFixed(precision);
