/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable no-var */

import { useMemory as useBareMemory } from "mem-box";

import type { AppServer, HttpServer } from "~service/logic/types";




/**
 * Type-concrete instance of useMemory.
 */
export const useMemory = useBareMemory<Ctx>;




/**
 * Global declaration merging.
 */
declare global {

    /**
     * Shared memory type augmentation.
     */
    interface Ctx {
        app: AppServer;
        dev: boolean;
        firstWorker: boolean;
        server: HttpServer;
    }

    /**
     * App-specific NodeJS namespace declaration merging:
     * global object type extension
     */
    var ctx: Ctx;

}
