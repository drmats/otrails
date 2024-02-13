/**
 * Sort utilities.
 *
 * @module @xcmats/sort
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */




/**
 * Lexicographical order.
 */
export const lex = (a: string, b: string): number =>
    a < b
        ? -1
        : a > b
            ? 1
            : 0;
