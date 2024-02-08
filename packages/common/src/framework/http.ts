/**
 * Http.
 *
 * @module @xcmats/framework-http
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */




/**
 * HTTP status messages.
 */
export enum HttpMessage {
    C400 = "bad request",
    C401noauth = "unauthorized",
    C401wrong = "wrong credentials",
    C403 = "forbidden",
    C404 = "not found",
    C405 = "method not allowed",
    C409 = "conflict",
    C500 = "internal server error",
}
