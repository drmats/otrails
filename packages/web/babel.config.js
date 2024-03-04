/**
 * Transpilation configuration (web).
 *
 * @module @xcmats/babel-web-config
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

"use strict";

// ...
const

    { realpathSync } = require("node:fs"),
    { resolve } = require("node:path"),
    appDirectory = realpathSync(process.cwd()),

    presets = [
        [
            "@babel/preset-env",
            {
                targets: {
                    esmodules: true,
                },
            },
        ],
        "@babel/preset-typescript",
        ["@babel/preset-react", {
            "runtime": "automatic",
        }],
    ],

    plugins = [
        [
            "module-resolver",
            {
                cwd: "packagejson",
                extensions: [".js", ".jsx", ".ts", ".tsx"],
                root: ["./"],
                alias: {
                    "~common": resolve(appDirectory, "..", "common", "src"),
                    "~web": resolve(appDirectory, "src"),
                },
            },
        ],
    ],

    config = {
        comments: false,
        shouldPrintComment: () => false,
    };




// ...
module.exports = function (api) {
    api.cache(true);

    return {
        presets,
        plugins,
        ...config,
    };
};
