/**
 * Otrails - trails, ours.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { share } from "mem-box";

import { plainRecordParse, type PlainRecord } from "~common/lib/struct";




/**
 * Run-time configuration variables.
 */
export default function configureVariables (): void {
    const vars = plainRecordParse(process.env.VARS ?? "{}");
    share({ vars });
}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        vars: PlainRecord;
    }
}
