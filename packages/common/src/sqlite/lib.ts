/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { Database } from "better-sqlite3";




/**
 * Set sane pragmas.
 */
export const setPragmas = (
    db: Database,
    opts?: {
        journal_mode?:
            "DELETE" | "TRUNCATE" | "PERSIST" | "MEMORY" | "WAL" | "OFF";
        synchronous?:
            "OFF" | "NORMAL" | "FULL" | "EXTRA";
    },
): string[] => {
    const journal_mode = opts?.journal_mode ?? "DELETE";
    const synchronous = opts?.synchronous ?? "NORMAL";
    const pragmas = [
        `busy_timeout = ${5000}`,
        `cache_size = ${2000}`,
        `foreign_keys = ${"ON"}`,
        `journal_mode = ${journal_mode}`,
        `journal_size_limit = ${64 * 1024 * 1024}`,
        `locking_mode = ${"NORMAL"}`,
        `mmap_size = ${128 * 1024 * 1024}`,
        `synchronous = ${synchronous}`,
    ];
    pragmas.forEach((setter) => db.pragma(setter));
    return pragmas;
};
