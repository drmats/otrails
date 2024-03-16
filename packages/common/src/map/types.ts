/**
 * Map-related types.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { ThemeVariant } from "~common/framework/theme";




/**
 * Map style source.
 */
export type MapStyleSource = {
    label: string;
    displayName?: string;
    url: string;
    themeVariant: ThemeVariant;
};
