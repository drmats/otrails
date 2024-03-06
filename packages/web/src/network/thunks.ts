/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { isObject } from "@xcmats/js-toolbox/type";

import type { ThunkType } from "~web/store/types";
import type { ComplexRecord } from "~common/lib/struct";
import { ACTION } from "~common/app/api";
import { JSON_FETCH_HEADERS } from "~web/network/constants";
import { selectBackendLocation } from "~web/network/selectors";
import { selectThemeLanguage } from "~web/layout/selectors";
import { FALLBACK_LANGUAGE } from "~common/framework/language";




/**
 * Spawn request against backend.
 */
const serviceRequest = (
    path: string,
    params?: Pick<RequestInit, "headers" | "method"> & { body?: unknown },
): ThunkType<Promise<Response>> =>
    async (_, getState, { act }) => {
        const state = getState();
        const backendLocation = selectBackendLocation(state);
        const currentLanguage = selectThemeLanguage(state);
        const content =
            params?.body
                ? JSON.stringify(params?.body)
                : undefined;

        try {

            act.network.START_REQUEST();

            return await fetch(
                `${backendLocation}${path}`,
                {
                    ...(content ? { body: content } : {}),
                    headers: {
                        ...JSON_FETCH_HEADERS,
                        "Accept-Language": currentLanguage ?? FALLBACK_LANGUAGE,
                        ...(
                            content
                                ? { "Content-Length": String(content.length) }
                                : {}
                        ),
                        ...(params?.headers ?? {}),
                    },
                    method: params?.method ?? "GET",
                    mode: "cors",
                    cache: "no-store",
                },
            );

        } finally {

            // prevent UI blinks for fast queries
            setTimeout(act.network.FINISH_REQUEST, 750);

        }
    };




/**
 * Spawn JSON request against backend.
 */
export const jsonRequest = (
    path: string,
    params?: Pick<RequestInit, "headers" | "method"> & { body?: unknown },
): ThunkType<Promise<unknown>> =>
    async (dispatch) => {
        const response = await dispatch(serviceRequest(path, params));
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
            const body = await response.json() as unknown;
            if (response.ok) return body;
            else throw new Error(
                (isObject(body) && body.error as string) ||
                "unknown error",
            );
        } else {
            if (response.ok) return {};
            else throw new Error(response.statusText);
        }
    };




/**
 * CORS proxy request.
 */
export const proxiedRequest = (
    opts: { url: string },
): ThunkType<Promise<ComplexRecord>> =>
    async (dispatch) => {
        return await dispatch(jsonRequest(
            ACTION.networkProxy,
            { method: "POST", body: opts },
        )) as ComplexRecord;
    };
