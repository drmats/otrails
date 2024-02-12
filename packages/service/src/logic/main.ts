/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import http from "node:http";
import express from "express";
import { share } from "mem-box";
import { b64dec } from "@xcmats/js-toolbox/codec";
import { devEnv } from "@xcmats/js-toolbox/utils";

import { useMemory } from "~service/logic/memory";
import { gitVersion } from "~common/lib/dev";
import { System } from "~common/app/models/setting";
import type { InitConfig } from "~service/logic/configuration";
import { listen } from "~service/logic/server";
import configureApp from "~service/setup/app";
import configureAuth from "~service/setup/auth";
import configureCatchAll from "~service/setup/catchall";
import configureDatabase from "~service/setup/database";
import configureDayjs from "~service/setup/dayjs";
import configureErrorHandling from "~service/setup/error";
import configureHeaders from "~service/setup/headers";
import configureLogging from "~service/setup/logging";
import configureModels from "~service/setup/models";
import configureRedirects from "~service/setup/redirects";
import configureRoutes from "~service/setup/routes";
import configureStatic from "~service/setup/static";
import configureTermination from "~service/setup/terminate";
import configureVariables from "~service/setup/vars";




/**
 * Application logic.
 */
export const main = async (opts: {
    configs: InitConfig;
    firstWorker?: boolean;
}): Promise<void> => {

    const
        // all workers are identical - this flag is used to de-duplicate
        // some logging messages
        firstWorker = opts.firstWorker ?? true,

        // development or production?
        dev = gitVersion() === "dev",

        // shared application objects
        ctx = useMemory(),

        // express application
        app = express(),

        // node's http server
        server = http.createServer(app);


    // share application-specific variables
    share({ app, dev, firstWorker, server });

    // expose shared memory as a global variable (for remote-debugging)
    if (devEnv()) {
        global.ctx = ctx;
    }

    // variables configuration
    await configureVariables();

    // express configuration
    configureApp();

    // logger configuration
    configureLogging();

    // set up dayjs library
    configureDayjs();

    // set up database
    await configureDatabase();

    // set up data models
    await configureModels({ execSchemas: true });

    // set up CORS
    configureHeaders();

    // authentication
    configureAuth(
        b64dec(opts.configs[System.MASTER_KEY]),
        opts.configs[System.BASIC_AUTH],
    );

    // redirects
    configureRedirects();

    // routes configuration
    configureRoutes();

    // static file sharing configuration
    configureStatic();

    // catch-all route configuration
    configureCatchAll();

    // error handling configuration
    configureErrorHandling();

    // graceful shutdown
    configureTermination();

    // listen and respond to requests
    listen();

};
