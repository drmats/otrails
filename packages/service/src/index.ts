/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable no-console */

import { b64enc, random } from "@xcmats/js-toolbox/codec";
import { devEnv, run } from "@xcmats/js-toolbox/utils";

import { hfid } from "~common/lib/ids";
import { System } from "~common/app/models/setting";
import { iAmMaster, master, worker } from "~service/logic/threading";
import { main } from "~service/logic/main";
import type { InitConfig } from "~service/logic/configuration";




/**
 * Thread entry point.
 */
run(async () => {

    if (iAmMaster()) {

        // secrets initialization in case of empty database
        const configs: InitConfig = {
            [System.MASTER_KEY]: b64enc(await random(64)),
            [System.BASIC_AUTH]: `${hfid()}:${hfid()}`,
        };

        if (devEnv() || process.argv[2] === "single") {
            // don't do threading in development environment:
            // just run application logic inside the only one process
            return await main({ configs });
        } else {
            // in non-dev environment run master
            return await master({ configs });
        }

    } else {

        // just run worker logic for each allocated thread
        return await worker();

    }

});
