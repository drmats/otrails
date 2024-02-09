/**
 * Vars.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import { share } from "mem-box";
import { isNumber, isString } from "@xcmats/js-toolbox/type";

import { plainRecordParse, type PlainRecord } from "~common/lib/struct";
import { printError } from "~common/lib/error";
import { DB_NAME } from "~service/logic/configuration";
import { readJSON } from "~common/lib/fs";




/**
 * This constant must match `DBFILE` constant inside ~common/scripts/vars.js`.
 */
const VARS_DB_RELATIVE_PATH = "data/vars.json";




/**
 * Run-time configuration variables.
 */
export default async function configureVariables (): Promise<void> {
    const rootDir = process.env.OTRAILS_ROOT;

    try {

        // check presence of the required environment variable
        if (!isString(rootDir)) {
            throw new Error("Please set [OTRAILS_ROOT] environment variable.");
        }

        // environment vars are either baked into dist files in production
        // by webpack, or read dynamically from known `vars.json` location
        const vars =
            isString(process.env.VARS)
                ? plainRecordParse(process.env.VARS)
                : await readJSON(join(rootDir, VARS_DB_RELATIVE_PATH));

        // extract configuration variables
        const { serviceDbDir, servicePort, tilesDir } = vars;

        // check `serviceDbDir` variable validity
        if (!isString(serviceDbDir)) {
            throw new Error("Missing or malformed [serviceDbDir] variable.");
        }

        // check `servicePort` variable validity
        if (!isNumber(servicePort)) {
            throw new Error("Missing or malformed [servicePort] variable.");
        }

        // check `tilesDir` variable validity
        if (!isString(tilesDir)) {
            throw new Error("Missing or malformed [tilesDir] variable.");
        }

        // `knownVars` are type-checked and sure to exist
        const knownVars = {
            serviceDb: join(rootDir, serviceDbDir, DB_NAME),
            serviceDbDir: join(rootDir, serviceDbDir),
            servicePort,
            tilesDir: join(rootDir, tilesDir),
        };

        // share with the app
        share({ vars, knownVars });

    } catch (e) {
        printError(e);
        process.exit(1);
    }

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        vars: PlainRecord;
        knownVars: {
            serviceDb: string;
            serviceDbDir: string;
            servicePort: number;
            tilesDir: string;
        };
    }
}
