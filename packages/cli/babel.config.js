/**
 * Transpilation configuration (node).
 *
 * @module @xcmats/babel-node-config
 * @license BSD-2-Clause
 * @copyright Mat. 2018-present
 */

"use strict";

// ...
const

    { realpathSync } = require("node:fs"),
    { resolve } = require("node:path"),
    appDirectory = realpathSync(process.cwd()),

    conf = {
        presets: [
            [
                "@babel/preset-env",
                {
                    exclude: [
                        "transform-async-to-generator",
                        "transform-regenerator",
                    ],
                    modules: "commonjs",
                    targets: {
                        node: "20.0.0",
                    },
                    useBuiltIns: false,
                },
            ],
            [
                "@babel/preset-typescript",
            ],
        ],
        plugins: [
            [
                "module-resolver",
                {
                    cwd: "packagejson",
                    extensions: [".js", ".ts"],
                    root: ["./"],
                    alias: {
                        "~cli": resolve(appDirectory, "src"),
                        "~common": resolve(appDirectory, "..", "common", "src"),
                    },
                },
            ],
        ],
        comments: false,
        shouldPrintComment: () => false,
        "sourceType": "unambiguous",
    };




// configuration
module.exports = function (api) {
    api.cache.using(() => process.env.BABEL_ENV);

    return {

        env: {

            // production environment
            production: conf,

            // development environment
            development: {
                ...conf,
                plugins: [
                    ...conf.plugins,
                    [
                        "@xcmats/otrails-common/scripts/babel-plugin-import-paths",
                        {
                            "extensions": ["sql"],
                        },
                    ],
                ],
            },

        },

    };
};
