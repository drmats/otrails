/**
 * Build-time helper functions.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

"use strict";

// ...
const
    {
        copyFileSync,
        mkdirSync,
        readdirSync,
    } = require("node:fs"),
    { join } = require("node:path"),
    { execSync } = require("node:child_process"),
    rimraf302 = require("rimraf");




// execute git command, intercept output and ignore all eventual errors
exports.git = (command) => {
    try {
        return execSync(`git ${command}`, { encoding: "utf8" }).trim();
    } catch {
        return "unknown";
    }
};




// create timestamp-based directory name
exports.timestampName = (prefix = "dir") =>
    `${prefix}-${(new Date()).toISOString().replace(/:/g, ".").slice(0, 19)}Z`;




// copy all files from `src` to `dst`, creating directories if necessary
// and applying `filter` on every nest level
exports.deepCopySync = (src, dst, filter = (_d, _l) => true, level = 0) => {
    mkdirSync(dst, { recursive: true });
    readdirSync(src, { withFileTypes: true })
        .filter((de) => filter(de, level))
        .forEach((de) =>
            (
                de.isFile()
                    ? (s, d, _f, _l) => copyFileSync(s, d)
                    : exports.deepCopySync
            )(
                join(src, de.name),
                join(dst, de.name),
                filter,
                level + 1,
            ),
        );
};




// promisified rimraf (needed for v.3.0.2)
exports.rimraf = (path, options) =>
    new Promise((resolve) => rimraf302(path, options ?? {}, resolve));
