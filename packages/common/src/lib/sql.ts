/**
 * SQL utilities.
 *
 * @module @xcmats/sql
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { bytesToHex, hexToBytes } from "@xcmats/js-toolbox/codec";
import {
    isBoolean,
    isNumber,
    isObject,
    isString,
} from "@xcmats/js-toolbox/type";




/**
 * Prepare escaped SQL literal (SQLite).
 */
export const sqlLiteral = (
    val: string | number | boolean | { blob: string },
): string => {
    if (isString(val)) return `'${
        val.replace(/[\n\t\r]/g, "").replace(/'/g, "''")
    }'`;
    if (isNumber(val)) return `${val}`;
    if (isBoolean(val)) return val ? "1" : "0";
    if (isObject(val) && isString(val.blob)) {
        try {
            return `X'${bytesToHex(hexToBytes(val.blob)).toUpperCase()}'`;
        } catch {
            return "X'00'";
        }
    }
    return "";
};




/**
 * Prepare escaped SQL identifier (SQLite).
 */
export const sqlIdentifier = <T>(
    field: T,
    table?: string,
): string => {
    if (isString(field)) {
        const safeField = `"${
            field
                .trim()
                .replace(/[\n\t\r]/g, "")
                .replace(/"/g, "\"\"")
        }"`;
        if (isString(table) && table !== "") {
            const safeTable = `"${
                table
                    .trim()
                    .replace(/[\n\t\r]/g, "")
                    .replace(/"/g, "\"\"")
            }"`;
            return `${safeTable}.${safeField}`;
        }
        return safeField;
    }
    return "";
};




/**
 * Escaped SQL `LIKE` literal (SQLite).
 */
export function sqlLikeLiteral (
    val: string,
    escape: string,
    wild?: "LEFT" | "RIGHT" | "BOTH" | "NONE",
): string;
export function sqlLikeLiteral<T> (
    val: T,
    escape: string,
    wild?: "LEFT" | "RIGHT" | "BOTH" | "NONE",
): T;
export function sqlLikeLiteral (
    val: unknown,
    escape: string,
    wild?: "LEFT" | "RIGHT" | "BOTH" | "NONE",
): unknown {
    if (isString(val)) {
        let candidate = "";
        if (escape.length === 1) {
            candidate = `${
                val
                    .replace(
                        new RegExp(
                            escape.replace(/\\/g, "\\\\"), "g",
                        ),
                        `${escape}${escape}`,
                    )
                    .replace(/%/g, `${escape}%`)
                    .replace(/_/g, `${escape}_`)
            }`;
        } else {
            candidate = `${
                val
                    .replace(/%/g, "")
                    .replace(/_/g, "")
            }`;
        }
        if (candidate !== "") switch (wild) {
            case "LEFT": return `%${candidate}`;
            case "RIGHT": return `${candidate}%`;
            case "BOTH": return `%${candidate}%`;
            case "NONE": return candidate;
        }
        return candidate;
    }
    return val;
}
