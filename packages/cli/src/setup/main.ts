/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

import { useMemory as useBareMemory } from "mem-box";




/**
 * Type-concrete instance of useMemory.
 */
export const useMemory = useBareMemory<Ctx>;




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Type placeholder for shared memory context.
     */
    interface Ctx {}

}
