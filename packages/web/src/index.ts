/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { getProcess, run } from "@xcmats/js-toolbox/utils";

import { plainRecordParse } from "~common/lib/struct";
import { ROOT_ELEMENT_ID } from "~web/root/config";
import packageInfo from "~web/../package.json";




/**
 * Run-time available environment variables.
 */
export const version = packageInfo.version;
export const env = (() => {
    const vars = plainRecordParse(process.env.VARS ?? "{}");
    return {
        ...getProcess().env,
        GIT_AUTHOR_DATE: process.env.GIT_AUTHOR_DATE,
        GIT_VERSION: process.env.GIT_VERSION,
        VARS: vars,
    };
})();




/**
 * Entry point - DOM ready.
 */
run(async () => {

    // fetch init code
    const { default: init } = await import("~web/root/init");

    // earliest init code - before DOM is ready
    const { clientEntry, store, ctx } = init();

    // create application DOM attach point
    const body = document.getElementsByTagName("body");
    const app = document.createElement("main");
    app.id = ROOT_ELEMENT_ID;
    body.item(0)?.prepend(app);

    // fetch root wrapper module tree
    const { default: createRootWrapper } =
        await import("~web/root/components/Wrapper");

    // instantiate root wrapper
    const RootWrapper = createRootWrapper(store);

    // execute client-entry code
    await clientEntry();

    // fetch application module tree
    const { App } = await import("~web/app/components/Main");

    // embed react application
    createRoot(app).render(
        createElement(RootWrapper, { element: createElement(App) }),
    );

    // run app initialization code
    await ctx.tnk.app.initialize();

});
