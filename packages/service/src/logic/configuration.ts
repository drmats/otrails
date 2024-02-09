/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { timeUnit } from "@xcmats/js-toolbox/utils";

import { System } from "~common/app/models/setting";




/**
 * All required configurations.
 */
export type InitConfig = {
    [System.BASIC_AUTH]: string;
    [System.MASTER_KEY]: string;
};




/**
 * Main database file name.
 */
export const DB_NAME = "main.sqlite";




/**
 * Default tile validity period.
 */
export const TILE_VALIDITY_PERIOD = 10 * timeUnit.minute;
