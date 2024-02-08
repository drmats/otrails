/**
 * Token manipulation helpers.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */




/**
 * Bearer JWT after decoding - shape.
 */
export type DecodedBearerToken =
    & {
        public_id: string;
        email?: string;
        roles: unknown[];
    }
    & {
        _?: string;
        iat?: number;
        exp?: number;
        header: unknown;
    };




/**
 * Convenience decoded token.
 *
 * @see authMw in `~service/setup/auth.ts`
 */
export const emptyToken: DecodedBearerToken = {
    public_id: "00000000000000000000000000000000",
    email: undefined,
    roles: [],
    header: { alg: "" },
};




/**
 * Helper type for `verifyBearerToken()`.
 */
export type BearerToken = { bearer: string };




/**
 * Convenience token.
 *
 * @see authMw in `~service/setup/auth.ts`
 */
export const emptyBearer: BearerToken = { bearer: "" };
