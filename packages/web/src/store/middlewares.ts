/**
 * Redux root middleware assembly.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { withExtraArgument } from "redux-thunk";

import type { Middleware } from "~web/store/types";
import { appMemory } from "~web/root/memory";




/**
 * Assembly list of all application-specific middlewares.
 */
export default function assemblyMiddlewares (): Middleware[] {
    const ctx = appMemory();

    return [
        withExtraArgument(ctx),
    ];
}
