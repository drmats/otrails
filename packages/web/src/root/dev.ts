/**
 * Dev tools.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { assign } from "@xcmats/js-toolbox/struct";
import { devEnv } from "@xcmats/js-toolbox/utils";
import { isObject } from "@xcmats/js-toolbox/type";

import { DEV_NAMESPACE_KEY } from "~web/root/config";
import { appMemory } from "~web/root/memory";
import packageInfo from "~web/../package.json";




/**
 * Returns standard browser's console in dev mode
 * and do-nothing-stub in production.
 */
export const devConsole = (): Console => devEnv() ?
    console :
    (Object.keys(console) as (keyof Omit<Console, "Console">)[])
        .reduce((a, k) => {
            a[k] = () => undefined;
            return a;
        }, {} as Console);




/**
 * Development environment libraries.
 */
const devEnvLibs = async (): Promise<Record<string, unknown>> => ({
    async: await import("~common/lib/async"),
    dev: await import("~common/lib/dev"),
    ids: await import("~common/lib/ids"),
    routing: await import("~common/framework/routing"),
    sql: await import("~common/lib/sql"),
    storeTools: await import("~web/store/tools"),
    string: await import("~common/lib/string"),
    struct: await import("~common/lib/struct"),
    time: await import("~common/lib/time"),
    timeDayjs: await import("~common/lib/dayjs"),
    toolbox: await import("@xcmats/js-toolbox"),
    type: await import("~common/lib/type"),
});




/**
 * Expose dev. namespace and some convenience shortcuts.
 */
export const exposeDevNamespace = async (): Promise<void> => {
    if (devEnv()) {
        const
            devNs = window[packageInfo.name.split("/")[1]],
            devNsContent = {
                libs: await devEnvLibs(),
                ctx: appMemory(),
                packageInfo,
            };
        if (isObject(devNs)) {
            assign(devNs, devNsContent);
        } else {
            window[packageInfo.name.split("/")[1]] = devNs;
        }
        window[DEV_NAMESPACE_KEY] = window[packageInfo.name.split("/")[1]];
    }
};
