/**
 * Asynchronous utilities.
 *
 * @module @xcmats/struct
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { createMutex } from "@xcmats/js-toolbox/async";
import { timeUnit } from "@xcmats/js-toolbox/utils";




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




/**
 * Create mutex with watchdog (10 minutes by default).
 *
 * `barrier`, in contrast to `mutex`, is preventing node process from exiting.
 *
 * Example:
 * ```
 * const barrier = createBarrier<void>();
 *
 * setTimeout(() => { barrier.resolve("Released!"); }, 2000);
 *
 * await barrier.lock();
 * ```
 */
export const createTimedBarrier = <T>(
    releaseTimeout = 10 * timeUnit.minute,
): ReturnType<typeof createMutex<T>> => {
    const mutex = createMutex<T>();
    let watchdog: ReturnType<typeof setTimeout> | undefined = undefined;
    return {
        ...mutex,
        lock: () => {
            watchdog = setTimeout(() => {
                mutex.reject(new Error("timeout"));
            }, releaseTimeout);
            return mutex.lock();
        },
        resolve: (v) => {
            if (watchdog) clearTimeout(watchdog);
            return mutex.resolve(v);
        },
        reject: (r) => {
            if (watchdog) clearTimeout(watchdog);
            return mutex.reject(r);
        },
    };
};
