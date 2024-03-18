/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */




/**
 * Helper for constructing property-based filter expressions.
 */
export const propFilter = (
    op: "any" | "all",
    prop: string,
    vals: (number | string)[],
) => [
    op,
    ...vals.map((v) => ["==", ["get", prop], v]),
];
