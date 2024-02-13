/**
 * Node data utils - http.
 *
 * @module @xcmats/node-data-http-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import http, {
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
    const o = options ?? { "headers": { "accept": "*/*" } };
    return new Promise(
        (resolve, reject) =>
            ((new URL(url)).protocol === "https:" ? https : http)
                .get(url, o, resolve)
                .on("timeout", reject)
                .on("error", reject),
    );
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
    const response = await get(url, options);

    // download
    if (response.statusCode === 200) {
        const fileStream = createWriteStream(destination);
        response.pipe(fileStream);
        fileStream.on("finish", () => {
            fileStream.close(() => {
                mutex.resolve(true);
            });
        });
        return mutex.lock();
    }

    // handle redirect
    if (
        response.statusCode === 302 &&
        isString(response.headers.location)
    ) {
        return getFile(response.headers.location, destination, options);
    }

    // failure
    return false;
};
