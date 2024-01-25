/**
 * Otrails - trails, ours.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

import { useMemory as useBareMemory } from "mem-box";
import { run } from "@xcmats/js-toolbox/utils";

import configureDatabase from "~cli/setup/database";
import configureVariables from "~cli/setup/vars";
import configureArgsParser from "~cli/setup/args";




/**
 * Type-safe instance of useMemory.
 */
export const useMemory: (() => Ctx) = useBareMemory;




/**
 * Entry point.
 */
run(async () => {

    // variables configuration
    configureVariables();

    // database configuration
    configureDatabase();

    // argument parsing configuration
    configureArgsParser();

});




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {}
}
