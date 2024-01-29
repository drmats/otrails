/**
 * Cryptography utilities.
 *
 * @module @xcmats/node-uuid
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { createHash } from "node:crypto";
import { takeEvery } from "@xcmats/js-toolbox/array";
import { pipe } from "@xcmats/js-toolbox/func";
import {
    b64enc,
    concatBytes,
    random,
    stringToBytes,
    timestamp,
} from "@xcmats/js-toolbox/codec";
import { isString } from "@xcmats/js-toolbox/type";




/**
 * Generate 128 bits UUID. Comprised of:
 * - 48 bits of milliseconds since epoch
 * - 32 bits of truncated `sha256` sum of input string (or more randomness)
 * - 48 random bits
 *
 * @async
 * @function genUUID
 * @param {String} [input]
 * @returns {Promise.<Uint8Array>}
 */
export const genUUID = async (
    input?: string,
): Promise<Uint8Array> => concatBytes(

    // 48 bits (6 bytes): timestamp - milliseconds since epoch
    timestamp(),

    // hashed input (or random)
    pipe(
        isString(input) ? input : b64enc(await random(32)),
    ) (
        stringToBytes,
        (b: Uint8Array) => createHash("sha256").update(b).digest(),
        (b: Uint8Array) => Array.from(b),
        takeEvery(8),
        (a: number[]) => Uint8Array.from(a),
    ) as Uint8Array,

    // 48 random bits (6 bytes)
    await random(6),

);
