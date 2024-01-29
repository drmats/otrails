/**
 * Id/labeling utilities.
 *
 * @module @xcmats/ids
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import {
    draw,
    flatten,
    head,
    last,
    range,
    zip,
} from "@xcmats/js-toolbox/array";
import { bytesToHex, timestamp } from "@xcmats/js-toolbox/codec";
import { mod, randomInt } from "@xcmats/js-toolbox/math";
import { empty, random } from "@xcmats/js-toolbox/string";
import { isString } from "@xcmats/js-toolbox/type";




/**
 * RequestId / TransactionId generator
 */
export const xidLike = (): string => bytesToHex(timestamp()) + random(8);




/**
 * Human-friendly identifier.
 */
export const hfid = (): string => {
    const vovels = "aeiouy";
    const consonants = "bcdfghjklmnprstwz";
    const len = randomInt() % 3 + 8;
    const chrs = randomInt() % 2 ? [vovels, consonants] : [consonants, vovels];
    return flatten(zip(
        range(len / 2).map(() => draw(head(chrs))),
        range(len / 2).map(() => draw(last(chrs))),
    )).join("");
};




/**
 * UUID formatter.
 */
export const uuidFormat = (uuid: string): string => {
    if (uuid.length !== 32) return uuid;
    return [
        uuid.slice(0, 8),
        uuid.slice(8, 12),
        uuid.slice(12, 16),
        uuid.slice(16, 20),
        uuid.slice(20, 32),
    ].join("-");
};




/**
 * Check hex-encoded UUID validity.
 */
export const isValidHexUuid = (candidate: unknown): candidate is string =>
    isString(candidate) && candidate !== empty() && candidate.length % 2 === 0;




/**
 * Absolutely unreliable hash of arbitrary size.
 */
export const primitiveHash = (input: Uint8Array, size: number): Uint8Array => {
    const mods = mod(size), modb = mod(256);
    const output = new Uint8Array(
        range(size).map((i) => modb(input.length * (i + size))),
    );

    input.forEach((b, i) => {
        for (let j = 0; j < size; j += 1) {
            output[mods(i + j)] = modb(
                output[mods(i + j)] + (b * (2 ** (j + 1))),
            );
        }
    });

    return output;
};
