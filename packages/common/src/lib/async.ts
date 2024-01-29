/**
 * Asynchronous utilities.
 *
 * @module @xcmats/struct
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { createMutex } from "@xcmats/js-toolbox/async";




/**
 * Simple, promise-based cache. Ensure passed `f` is invoked once:
 * - first call to `cached(f)` actually invokes `f`
 * - all subsequent calls to `cached(f)` returns cache contents
 * - next call after `cached(f).reset()` call actually invokes `f` (again)
 */
export const cached = <T>(f: () => Promise<T>): {
    (): Promise<T>;
    reset: () => void;
} => {
    const cache = { m: createMutex<T>(), invoked: false };
    const aux = () => {
        if (!cache.invoked) {
            f().then(cache.m.resolve).catch(cache.m.reject);
            cache.invoked = true;
        }
        return cache.m.lock();
    };
    const reset = () => {
        if (cache.invoked) {
            cache.m = createMutex<T>();
            cache.invoked = false;
        }
    };
    return Object.assign(aux, { reset });
};
