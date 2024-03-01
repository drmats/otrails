/**
 * App-wise, typed shared memory.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

import { useRef } from "react";
import { useMemory as useBareMemory } from "mem-box";




/**
 * App-specific instance of useMemory.
 */
export const appMemory = useBareMemory<Ctx>;




/**
 * Actual hook to use inside components.
 */
export const useMemory = (): Ctx => {
    const mem = useRef(appMemory());
    return mem.current;
};




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Type placeholder for shared memory context.
     */
    interface Ctx {}

}
