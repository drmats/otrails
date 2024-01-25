/**
 * Dev. helpers (compile-time dependent).
 *
 * @module @xcmats/dev-lib
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */




/**
 * Obtain compile-time-backed last commit author date.
 */
export const gitAuthorDate = (): string => {
    try {
        return process.env.GIT_AUTHOR_DATE ?? "dev";
    } catch {
        return "dev";
    }
};




/**
 * Obtain compile-time-backed last commit hash.
 */
export const gitVersion = (): string => {
    try {
        return process.env.GIT_VERSION ?? "dev";
    } catch {
        return "dev";
    }
};
