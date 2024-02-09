/**
 * Type utilities.
 *
 * @module @xcmats/type
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import {
    type BasicData as JsToolboxBasicData,
    isBasicData as jsToolboxIsBasicData,
    isBasicDataOrUndefined as jsToolboxIsBasicDataOrUndefined,
} from "@xcmats/js-toolbox/struct";
import {
    isArray,
    isDate,
    isObject,
    isRegExp,
    isString,
} from "@xcmats/js-toolbox/type";




/**
 * "Hidden"/distinguishing field for 'Opaque' type.
 */
declare const __type: unique symbol;




/**
 * Nominal type helper - flow's "opaque" emulation.
 * @see https://github.com/Microsoft/TypeScript/issues/202
 *
 * Usage / caveats:
 * ```
 * type MetersPerSecond = Opaque<number, "MetersPerSecond">;
 * type KilometersPerHour = Opaque<number, "KilometersPerHour">;
 *
 * const lift = 2 as MetersPerSecond;
 * const speed = 35 as KilometersPerHour;
 * const temperature = 17; // plain number
 *
 * if (lift == speed) { ... }         // type error - good!
 * if (lift === speed) { ... }        // type error - good!
 *
 * if (lift < speed) { ... }          // NO type error - bad :(
 * if (lift == temperature) { ... }   // NO type error - bad :(
 * if (lift === temperature) { ... }  // NO type error - bad :(
 *
 * const compute = (l: MetersPerSecond, s: KilometersPerHour): number => {
 *     // ...
 * };
 *
 * const ld = compute(speed, lift);         // type error - good!
 * const ld = compute(temperature, speed);  // type error - good!
 * ```
 */
export type Opaque<Base, T> = Base & { readonly [__type]: T };




/**
 * Usual key types used in Records.
 */
export type ValidKeys = string | number | symbol;




/**
 * Plain, old JS datatypes. Serializable. Non recursive type.
 */
export type PlainValue = JsToolboxBasicData;




/**
 * Check if value is of `PlainValue` type. Non recursive check.
 */
export const isPlainValue = jsToolboxIsBasicData;




/**
 * Check if value is of `PlainValue` or `undefined` type.
 * Non-recursive check.
 */
export const isPlainValueOrUndefined = jsToolboxIsBasicDataOrUndefined;




/**
 * Plain-and-simple values, arrays and objects.
 * Suitable as type value for simple Key-Val stores.
 * Serializable.
 * Recursive type.
 *
 * Note: there's no way of expressing "holes" in sparse arrays or missing
 * keys in records, other than stating that type of value of "hole",
 * when accessed, is `undefined`. Thus, on the "outer level", `ComplexValue`
 * is guaranteed to be defined (`PlainValue`, `Array` or `Object`), but
 * recursive (deep) accesses may result in undefined values.
 */
export type ComplexValue =
    | PlainValue
    | (ComplexValue | undefined)[]
    | { [key: string]: ComplexValue | undefined };




/**
 * Check if value is of `ComplexValue` type. Recursive check.
 */
export const isComplexValue = (c: unknown): c is ComplexValue =>
    isPlainValue(c) ||
    (isArray(c) && c.every(isComplexValueOrUndefined)) ||
    (
        isObject(c) && !isDate(c) && !isRegExp(c) &&
        Object.entries(c).every(
            ([k, v]) => isString(k) && isComplexValueOrUndefined(v),
        )
    );




/**
 * Check if value is of `ComplexValue` or `undefined` type. Recursive check.
 */
export const isComplexValueOrUndefined = (
    c: unknown,
): c is ComplexValue | undefined =>
    typeof c === "undefined" || isComplexValue(c);




/**
 * More-than simple/serializable data set (superset of `ComplexValue`).
 * Non-serializable. Recursive.
 */
export type ExtendedValue =
    | string
    | number
    | boolean
    | Date
    | (ExtendedValue | undefined)[]
    | { [key: string]: ExtendedValue | undefined };




/**
 * Generic empty object - type.
 */
export type EmptyObject = Record<string, never>;




/**
 * Generic empty object - instance.
 */
export const emptyObject = {} as EmptyObject;




/**
 * Free-form record generic type.
 */
export type FreeFormRecord<V> = Partial<Record<string, V>>;




/**
 * Checks if candidate `c` can be indexed with strings.
 */
export const isUnknownRecord = (c: unknown): c is FreeFormRecord<unknown> =>
    isObject(c) && !isDate(c) && !isRegExp(c) &&
    Object.keys(c).every(isString);




/**
 * Allow first-level null values in `FreeFormRecord`.
 */
export type FreeFormRecipe<FFR> =
    FFR extends FreeFormRecord<infer V> ?
        FreeFormRecord<V | null> : never;




/**
 * Make all properties of T and it's descendants optional.
 */
export type RecursivePartial<T> = T extends Record<never, never> ? {
    [P in keyof T]?: RecursivePartial<T[P]>;
} : Partial<T>;




/**
 * Object type emulating sparse array.
 */
export type SparseArrayLike<T> = Partial<Record<number, T>>;




/**
 * Type `T` or `undefined`.
 */
export type OrUndefined<T> = T | undefined;




/**
 * Meta-predicate. Gets predicate and returns augmented version
 * alowing `undefined`.
 */
export const orUndefined = <T>(
    predicate: (c: unknown) => c is T,
): (c: unknown) => c is OrUndefined<T> => (
    (c) => predicate(c) || typeof c === "undefined"
) as (c: unknown) => c is OrUndefined<T>;




/**
 * Type `T` or `null`.
 */
export type OrNull<T> = T | null;




/**
 * Meta-predicate. Gets predicate and returns augmented version
 * alowing `null`.
 */
export const orNull = <T>(
    predicate: (c: unknown) => c is T,
): (c: unknown) => c is OrNull<T> => (
    (c) => predicate(c) || c === null
) as (c: unknown) => c is OrNull<T>;
