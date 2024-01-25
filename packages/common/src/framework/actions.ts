/**
 * Actions.
 *
 * @module @xcmats/framework-actions
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { type PlainRecord } from "~common/lib/struct";
import { type EmptyObject } from "~common/lib/type";




/**
 * Backend action - failure response type.
 */
export type ResponseErr = {
    error: string;
};




/**
 * Command Line Interface action type.
 */
export type CliAction<P extends PlainRecord = EmptyObject> = (
    params: P,
) => Promise<void>;
