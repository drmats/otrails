/**
 * Typed structure utilities.
 *
 * @module @xcmats/struct
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { handleException } from "@xcmats/js-toolbox/func";
import { access as jsToolboxAccess, dict } from "@xcmats/js-toolbox/struct";
import {
    isArray,
    isDate,
    isObject,
    isRegExp,
    isString,
    toBool,
} from "@xcmats/js-toolbox/type";

import {
    isComplexValueOrUndefined,
    isPlainValue,
    isPlainValueOrUndefined,
    isUnknownRecord,
    type ComplexValue,
    type ExtendedValue,
    type FreeFormRecipe,
    type FreeFormRecord,
    type PlainValue,
    type ValidKeys,
} from "~common/lib/type";




/**
 * Plain record - one-level-deep object consisiting only of plain values.
 *
 */
export type PlainRecord = FreeFormRecord<PlainValue>;




/**
 * Plain, non-recursive record - type predicate.
 */
export const isPlainRecord = (c: unknown): c is PlainRecord =>
    isObject(c) && !isDate(c) && !isRegExp(c) &&
    Object.entries(c).every(
        ([k, v]) => isString(k) && isPlainValueOrUndefined(v),
    );




/**
 * Safe version of `JSON.parse()`.
 * Ensure parsed output is always of `PlainRecord` type
 * (empty object in case of errors).
 */
export const plainRecordParse = (input: string): PlainRecord =>
    handleException<PlainRecord, PlainRecord>(
        () => {
            const parsed: unknown = JSON.parse(input);
            if (isPlainRecord(parsed)) return parsed;
            return {};
        },
        () => ({}),
    );




/**
 * Wrapped `JSON.stringify()` - checks input before stringification.
 * Always return "parsable" string (`"{}"` at minimum).
 */
export const plainRecordStringify = (input?: PlainRecord): string => {
    if (isPlainRecord(input)) return JSON.stringify(input);
    return JSON.stringify({});
};




/**
 * Type alias for recursive data types (objects) - serializable.
 * It's basically a `ComplexValue` enforced to be `object` on the outer level.
 */
export type ComplexRecord = FreeFormRecord<ComplexValue>;




/**
 * `Check if value is of `ComplexRecord` type. Recursive check.
 */
export const isComplexRecord = (c: unknown): c is ComplexRecord =>
    isObject(c) && !isDate(c) && !isRegExp(c) &&
    Object.entries(c).every(
        ([k, v]) => isString(k) && isComplexValueOrUndefined(v),
    );




/**
 * `PlainRecipe` is the `PlainRecord` with nulls allowed.
 */
export type PlainRecipe = FreeFormRecipe<PlainRecord>;




/**
 * Free-form recipe - type predicate.
 */
export const isPlainRecipe = (c: unknown): c is PlainRecipe =>
    isObject(c) && !isDate(c) && !isRegExp(c) &&
    Object.entries(c).every(
        ([k, v]) => isString(k) && (v === null || isPlainValueOrUndefined(v)),
    );




/**
 * Properly type-casted standard `Object.keys()` for typed records.
 */
export const recordKeys = <Key extends ValidKeys, Value>(
    record: { [K in Key]?: Value; },
): Exclude<Key, symbol>[] => Object.keys(record) as Exclude<Key, symbol>[];




/**
 * Take the input `FreeFormRecord` and create modified output
 * according to passed `FreeFormRecipe`.
 *
 * ```
 * const input = { a: "123", b: "45" };
 * const output = modifyRecord(input, { a: "67", b: null, c: "890" });
 * // output = { a: "67", c: "890" }
 * ```
 *
 * It can modify `PlainRecord` and `ComplexRecord`
 * (first-level only, non-recursive).
 */
export const recordModify = <T>(
    input: FreeFormRecord<T>,
    recipe?: FreeFormRecipe<FreeFormRecord<T>>,
): FreeFormRecord<T> => {
    if (!recipe) return input;
    const output: FreeFormRecord<T> = { ...input };
    recordKeys(recipe).forEach((key) => {
        const value = recipe[key];
        if (value === null) delete output[key];
        else output[key] = value;
    });
    return output;
};




/**
 * Sort keys of record alphabetically.
 */
export const sortRecord = (
    record: ComplexRecord,
    opts?: { recursive?: boolean },
): ComplexRecord => dict(
    recordKeys(record).sort().map((key) => {
        const child = record[key];
        return [
            key,
            opts?.recursive && isObject(child)
                ? sortRecord(child as ComplexRecord, opts)
                : child,
        ];
    }),
);




/**
 * Superset of `ComplexRecord` - recursive and non-serializable.
 */
export type ExtendedRecord = FreeFormRecord<ExtendedValue>;




/**
 * Object key names remapping helper:
 * add prefix to each key name (type domain).
 */
export type PrefixKeys<P extends string, O, Sep extends string = "_"> = {
    [K in keyof O as K extends string ? `${P}${Sep}${K}` : never]: O[K];
};




/**
 * Object key names remapping helper:
 * add prefix to each key name (runtime domain).
 */
export const prefixKeys = <
    P extends string,
    O extends { [K in keyof O]: O[K]; },
    Sep extends string = "_",
>(prefix: P, obj: O, sep: Sep = "_" as Sep): PrefixKeys<P, O, Sep> =>
    Object.fromEntries(
        Object
            .entries(obj)
            .map(([k, v]) => [`${prefix}${sep}${k}`, v]),
    ) as PrefixKeys<P, O, Sep>;




/**
 * Object key names remapping helper:
 * remove prefix from each key name (type domain).
 */
export type DePrefixKeys<P extends string, O, Sep extends string = "_"> = {
    [K in keyof O as K extends `${P}${Sep}${infer N}` ? N : never]: O[K];
};




/**
 * Object key names remapping helper:
 * remove prefix from each key name (runtime domain).
 */
export const dePrefixKeys = <
    P extends string,
    O extends { [K in keyof O]: O[K]; },
    Sep extends string = "_",
>(prefix: P, obj: O, sep: Sep = "_" as Sep): DePrefixKeys<P, O, Sep> => {
    const p = `${prefix}${sep}`;
    return Object.fromEntries(
        Object
            .entries(obj)
            .filter(([k]) => k.startsWith(p))
            .map(([k, v]) => [k.slice(p.length), v]),
    ) as DePrefixKeys<P, O, Sep>;
};




/**
 * Apply `path` to an object `o`. Return element reachable through
 * that `path` or `def` value.
 *
 * Example:
 *
 * ```
 * access({ a: { b: [10, { c: 42 }] } }, ["a", "b", 1, "c"])  ===  42
 * ```
 */
export const access: {
    <
        InputType extends ComplexRecord,
    >(o: InputType): (
        InputType
    );
    <
        InputType extends ComplexRecord,
        KeyType extends string,
        OutputType extends ComplexValue,
    >(o: InputType, path: readonly KeyType[]): (
        OutputType | undefined
    );
    <
        InputType extends ComplexRecord,
        KeyType extends string,
        DefaultType extends ComplexValue,
        OutputType extends ComplexValue,
    >(o: InputType, path: readonly KeyType[], def: DefaultType): (
        DefaultType | OutputType
    );
} = jsToolboxAccess;




/**
 * Perform deep merging.
 *
 * - `result` is `base` extended with `ext`
 * - `result` always have all keys from `base`
 * - `result` can be "bigger" than `base` if `opts.allowGrowth` is set to true
 * - `result` can contain props with `undefined` value if `ext` have them
 *     on corresponding keys and `opts.allowGrowth` is set to true
 *
  * Note: array is treated as plain value ("unit").
 */
export const deepMerge = (
    base: ComplexValue,
    ext: ComplexValue,
    opts?: { allowGrowth?: boolean },
): ComplexValue => {
    if (
        isPlainValue(base) || isArray(base) ||
        isPlainValue(ext) || isArray(ext)
    ) return ext;

    const extKeys = Object.keys(ext);
    if (extKeys.length === 0) return {};

    const extOverBase = {} as ComplexRecord;

    extKeys.forEach((k) => {
        const b = base[k], e = ext[k];
        if (typeof e !== "undefined") {
            if (typeof b !== "undefined") extOverBase[k] = deepMerge(b, e, opts);
            else if (opts?.allowGrowth) extOverBase[k] = e;
        } else if (opts?.allowGrowth) extOverBase[k] = e;
    });

    return {
        ...base,
        ...extOverBase,
    };
};




/**
 * Perform deep truncation of `candidate` using `template`.
 *
 * - `result` is `candidate` conformed to `template`
 * - `result` consist only of keys present in `template`
 * - value types present in `result` and `template` on corresponding keys
 *     are identical
 * - if `opts.loose` is set to true then properties that *do exist*
 *     in `template`, but which are set to `undefined` (as opposed to
 *     properties that *do not exist*) won't be used to reason about
 *     type of value presented in candidate on corresponding keys, e.g.:
 *     ```
 *     template = { a: undefined }
 *     candidate = { a: 42, b: "something" }
 *     result = { a: 42 } // opts.loose = true
 *     result = {} // opts.loose = false
 *     ```
 *     Also, in this mode, a key set to `undefined` in `candidate` (but
 *     one that *do exists* will be copied to `result` if `template` has
 *     the corresponding key also set to `undefined`.
 * - if `opts.allowEmptyGrowth` is set to true then all properties
 *     in `candidate` that are objects are treated as plain values if
 *     corresponding keys in `template` are empty objects (`{}`), e.g.:
 *     ```
 *     template = { a: {} }
 *     candidate = { a: { oh: "my" }, b: "something" }
 *     result = { a: { oh: "my" } } // opts.allowEmptyGrowth = true
 *     result = {} // opts.allowEmptyGrowth = false
 *     ```
 * - `result` can be "less or equal" than template
 *
 * Note: array is treated as plain value ("unit").
 */
export const deepConform = (
    template: ComplexValue | undefined,
    candidate: ComplexValue | undefined,
    opts?: { loose?: boolean; allowEmptyGrowth?: boolean },
): ComplexValue | undefined => {
    if (
        typeof template === "undefined" ||
        typeof candidate === "undefined" ||
        typeof template !== typeof candidate
    ) return undefined;

    const templateIsRecord = isUnknownRecord(template);
    const candidateIsRecord = isUnknownRecord(candidate);

    if (!templateIsRecord && !candidateIsRecord) {
        if (typeof template === typeof candidate) return candidate;
        else return undefined;
    }

    if (templateIsRecord && candidateIsRecord) {

        const templateKeys = Object.keys(template);
        const candidateKeys = Object.keys(candidate);

        if (toBool(opts?.allowEmptyGrowth) && templateKeys.length === 0) {
            return { ...candidate };
        }

        const conformed = {} as ComplexRecord;

        candidateKeys.forEach((k) => {
            const t = template[k], c = candidate[k];
            if (
                toBool(opts?.loose) &&
                typeof t === "undefined" && Object.hasOwn(template, k) &&
                Object.hasOwn(candidate, k)
            ) {
                conformed[k] = c;
            } else {
                const conformCandidate = deepConform(t, c, opts);
                if (typeof conformCandidate !== "undefined")
                    conformed[k] = conformCandidate;
            }
        });

        const conformedKeys = Object.keys(conformed);

        return (
            conformedKeys.length > 0 || candidateKeys.length === 0
                ? conformed
                : undefined
        );

    }

    return undefined;
};
