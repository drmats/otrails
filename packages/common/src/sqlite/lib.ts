/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import type { Database } from "better-sqlite3";




/**
 * Set sane pragmas.
 */
export const setPragmas = (db: Database): string[] => {
    const pragmas = [
        `busy_timeout = ${5000}`,
        `cache_size = ${2000}`,
        `foreign_keys = ${"ON"}`,
        `journal_mode = ${"WAL"}`,
        `journal_size_limit = ${64 * 1024 * 1024}`,
        `mmap_size = ${128 * 1024 * 1024}`,
        `synchronous = ${"FULL"}`,
    ];
    pragmas.forEach((setter) => db.pragma(setter));
    return pragmas;
};
