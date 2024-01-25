/**
 * Module declaration for simple import path replacer.
 *
 * @module @xcmats/node-pg-sql-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

declare module "*.sql" {
    const value: string;
    export = value;
}
