/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { run } from "@xcmats/js-toolbox/utils";

import configureArgsParser from "~cli/setup/args";
import configureDatabase from "~cli/setup/database";
import configureTermination from "~cli/setup/terminate";
import configureVariables from "~cli/setup/vars";




/**
 * Entry point.
 */
run(async () => {

    // variables configuration
    configureVariables();

    // database configuration
    configureDatabase();

    // termination configuration
    configureTermination();

    // argument parsing configuration
    await configureArgsParser();

});
