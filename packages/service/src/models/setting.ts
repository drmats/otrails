/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { Database } from "better-sqlite3";
import { isString } from "@xcmats/js-toolbox";

import type { ComplexValue, OrUndefined } from "~common/lib/type";
import type { PlainRecipe } from "~common/lib/struct";
import { access, isComplexRecord, recordModify } from "~common/lib/struct";




/**
 * Setting model - schema.
 */
export const schema = () => `
    CREATE TABLE IF NOT EXISTS setting (
        key TEXT PRIMARY KEY,
        val TEXT NOT NULL
    );
`;




/**
 * Setting model (key-val).
 */
export default function setting (db: Database) {

    // ...
    const sql = {

        // ...
        allSettings: () => `
            SELECT *
            FROM setting
        `,


        // ...
        count: () => `
            SELECT count(*)
            FROM setting
        `,

    } as const;




    // ...
    const statement = {

        // ...
        count: db.prepare<[]>(`
            ${sql.count()};
        `).pluck(),


        // ...
        list: db.prepare(`
            ${sql.allSettings()};
        `),


        // ...
        set: db.prepare<{
            key: string;
            val: string;
        }>(`
            INSERT INTO setting (key, val)
            VALUES ($key, $val)
            ON CONFLICT (key) DO UPDATE
                SET val = excluded.val
            RETURNING *;
        `),


        // ...
        get: db.prepare<{
            key: string;
        }>(`
            ${sql.allSettings()}
            WHERE key = $key;
        `),


        // ...
        delete: db.prepare<{
            key: string;
        }>(`
            DELETE FROM setting
            WHERE key = $key;
        `),

    } as const;




    // ...
    const pub = {

        // ...
        count: (): number => Number(statement.count.get()),


        // ...
        all: (): ComplexValue =>
            (statement.list.all() as { key: string; val: string }[])
                .reduce((acc, { key, val }) => {
                    try { acc[key] = JSON.parse(val) as ComplexValue; }
                    catch { acc[key] = val; }
                    return acc;
                }, {} as Record<string, ComplexValue>) as ComplexValue,


        // ...
        get: (key: string): OrUndefined<ComplexValue> => {
            const statementGetResult = statement.get.get({ key });
            if (!isComplexRecord(statementGetResult)) return undefined;
            const val = access(statementGetResult, ["val"]);
            try {
                if (isString(val)) return JSON.parse(val) as ComplexValue;
                return val;
            } catch {
                return val;
            }
        },


        // ...
        set: (key: string, val: ComplexValue): void => {
            statement.set.run({ key, val: JSON.stringify(val) });
        },


        // ...
        update: (
            key: string,
            recipe?: PlainRecipe,
        ): OrUndefined<ComplexValue> => {
            const val = pub.get(key);
            let newVal = val;
            if (isComplexRecord(val)) {
                newVal = recordModify(val, recipe);
            } else if (typeof recipe !== "undefined") {
                newVal = recordModify({}, recipe);
            }
            if (typeof newVal !== "undefined") pub.set(key, newVal);
            return newVal;
        },

        // ...
        delete: (key: string): void => {
            statement.delete.run({ key });
        },

    } as const;




    return {
        ...pub,
        $: { sql, statement },
    } as const;

}
