/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { FilterSpecification } from "maplibre-gl";




/**
 * Helper for constructing property-based filter expressions.
 */
export const propFilter = (
    op: "any" | "all",
    prop: string,
    vals: (number | string)[],
): FilterSpecification => [
    op,
    ...vals.map((v) => ["==", ["get", prop], v]),
] as FilterSpecification;
