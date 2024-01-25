/**
 * Node pgsql utilities.
 *
 * @module @xcmats/node-pg-sql-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { QueryFile } from "pg-promise";

import type { FreeFormRecord } from "~common/lib/type";




/**
 * Form a database connection string based on property object.
 */
export const buildPgConnectionString = (opts: {
    user: string;
    pass: string;
    host: string;
    name: string;
}): string => {
    return `postgres://${opts.user}:${opts.pass}@${opts.host}/${opts.name}`;
};




/**
 * QueryFiles linking helper with memoization.
 */
export const sqlMemo = (): ((file: string) => QueryFile) => {
    const qfs: FreeFormRecord<QueryFile> = {};
    return (filePath) => {
        const candidate = qfs[filePath];
        if (typeof candidate === "undefined") {
            const newQueryFile = new QueryFile(filePath, { minify: true });
            qfs[filePath] = newQueryFile;
            return newQueryFile;
        }
        return candidate;
    };
};
