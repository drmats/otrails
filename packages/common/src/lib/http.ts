/**
 * Node data utils - http.
 *
 * @module @xcmats/node-data-http-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import http, {
    type ClientRequest,
    type RequestOptions as HTTPRequestOptions,
    type IncomingMessage,
} from "node:http";
import https, {
    type RequestOptions as HTTPSRequestOptions,
} from "node:https";
import { createWriteStream } from "node:fs";
import { createMutex } from "@xcmats/js-toolbox/async";
import { clamp } from "@xcmats/js-toolbox/math";
import { isString } from "@xcmats/js-toolbox/type";




/**
 * Parse content-length header (assume its errorneus content).
 *
 * @function parseContentLength
 * @param cl content length string (candidate)
 * @returns parsed content length (or 0)
 */
export const parseContentLength = (cl?: string): number => {
    try { return parseInt(cl ?? "0", 10); }
    catch { return 0; }
};




/**
 * Async HTTP(S) GET helper.
 * Returns `{ request, response }` object.
 */
export async function httpGet (
    url: string | URL,
): Promise<{ request: ClientRequest; response: IncomingMessage }>;
export async function httpGet (
    url: string | URL,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<{ request: ClientRequest; response: IncomingMessage }>;
export async function httpGet (
    url: string | URL,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<{ request: ClientRequest; response: IncomingMessage }> {
    const o = options ?? { "headers": { "accept": "*/*" } };
    const mutex =
        createMutex<{ request: ClientRequest; response: IncomingMessage }>();
    const request: ClientRequest =
        ((new URL(url)).protocol === "https:" ? https : http)
            .get(url, o, (response) => mutex.resolve({ request, response }))
            .on("timeout", mutex.reject)
            .on("error", mutex.reject);
    return mutex.lock();
}




/**
 * Async HTTP(S) GET helper with automatic redirect (302) handling.
 * Returns `{ request, response }` object.
 */
export const httpGetHandleRedirect = async (
    url: string | URL,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<{ request: ClientRequest; response: IncomingMessage }> => {
    const { request, response } = await httpGet(url, options);

    // handle redirect
    if (
        response.statusCode === 302 &&
        isString(response.headers.location)
    ) {
        try {
            return await httpGetHandleRedirect(
                response.headers.location, options,
            );
        } finally {
            request.destroy();
        }
    }

    return { request, response };
};




/**
 * Async HTTP(S) GET helper.
 * Returns just `response`.
 */
export async function get (
    url: string | URL,
): Promise<IncomingMessage>;
export async function get (
    url: string | URL,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<IncomingMessage>;
export async function get (
    url: string | URL,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<IncomingMessage> {
    const { response } = await httpGet(url, options);
    return response;
}




/**
 * Collect all incoming message data (up to maxlen size - default 100MB).
 *
 * @function collectData
 * @param response node-compatible IncomingMessage object
 * @param [maxlen] assumed maximum size of data
 * @returns buffer object with collected data
 */
export const collectData = async (
    response: IncomingMessage,
    maxlen = 1024**2 * 100,
): Promise<Buffer> =>
    new Promise((resolve, reject) => {
        const
            contentLength = clamp(
                0, maxlen,
                parseContentLength(response.headers["content-length"]),
            ),
            chunks: Buffer[] = [];
        let size = 0;
        response
            .on("data", (chunk: Buffer) => {
                const newSize = size + chunk.length;
                if (newSize <= contentLength) {
                    chunks.push(chunk);
                    size = newSize;
                }
            })
            .on("end", () => resolve(Buffer.concat(chunks)))
            .on("error", reject);
    });




/**
 * Download file (wget).
 */
export const getFile = async (
    url: string | URL,
    destination: string,
    options?: HTTPRequestOptions | HTTPSRequestOptions,
): Promise<boolean> => {
    const mutex = createMutex<boolean>();
    const { request, response } = await httpGetHandleRedirect(url, options);

    // download
    if (response.statusCode === 200) {
        const fileStream = createWriteStream(destination);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
            fileStream.close(() => {
                request.end();
                mutex.resolve(true);
            });
        });
        return mutex.lock();
    }

    return false;
};
