/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { isString } from "@xcmats/js-toolbox/type";




/**
 * Possible operations.
 */
export enum Op {
    ALL = "all",
    GET = "get",
    SET = "set",
    DELETE = "delete",
}




/**
 * Op type predicate.
 */
export const isOp = (candidate: unknown): candidate is Op =>
    isString(candidate) && (Object.values(Op) as string[]).includes(candidate);




/**
 * System settings keys.
 */
export enum System {
    BASIC_AUTH = "APP_BASIC_AUTH",
    MASTER_KEY = "APP_MASTER_KEY",
}
