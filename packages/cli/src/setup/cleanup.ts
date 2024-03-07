/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { useMemory } from "~cli/setup/memory";




/**
 * Process cleanup configuration.
 */
export default function configureCleanup (): void {

    const { pgp } = useMemory();

    return pgp.end();

}
