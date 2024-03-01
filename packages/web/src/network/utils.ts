/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { isString } from "@xcmats/js-toolbox/type";

import { appMemory } from "~web/root/memory";
import { env } from "~web/index";




/**
 * Set backend address.
 */
export const setBackendAddress = (): void => {
    const { act } = appMemory();

    if (isString(env.VARS.backend)) {
        act.network.SET_BACKEND_URL(env.VARS.backend);
    }

    if (isString(env.VARS.path)) {
        act.network.SET_PATH_PREFIX(env.VARS.path);
    }

};
