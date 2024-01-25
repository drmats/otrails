/**
 * Bundle configuration - node.
 *
 * @module @xcmats/webpack-node-config
 * @license BSD-2-Clause
 * @copyright Mat. 2018-present
 */

/* eslint-disable @typescript-eslint/no-var-requires */

"use strict";

// ...
const

    webpack = require("webpack"),
    { realpathSync } = require("fs"),
    { resolve } = require("path"),
    MinifyPlugin = require("terser-webpack-plugin"),
    ESLintPlugin = require("eslint-webpack-plugin"),
    nodeExternals = require("webpack-node-externals"),
    { git } = require("@xcmats/otrails-common/scripts/lib"),
    { readVars } = require("@xcmats/otrails-common/scripts/vars"),
    appName = require("./package.json").name,
    appDirectory = realpathSync(process.cwd()),
    buildMode = process.env["BABEL_ENV"] || "production";




// ...
const webpackAsyncConfig = async () => {

    const vars = JSON.stringify(await readVars());

    return {

        mode: buildMode,


        target: "node",


        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                "~cli": resolve(appDirectory, "src"),
                "~common": resolve(appDirectory, "..", "common"),
            },
        },

        externalsPresets: { node: true },
        externals: [
            "yargs/yargs",
            "yargs/helpers",
            nodeExternals({
                allowlist: [
                    /@xcmats\/js-toolbox(\/.*)?/,
                    /@xcmats\/otrails-common(\/.*)?/,
                    "mem-box",
                    "pg-promise",
                ],
            }),
        ],


        entry: {
            [appName.split("/")[1]]: resolve(appDirectory, "src/index.ts"),
        },


        output: {
            chunkFilename: "[name].c.js",
            filename: "[name].js",
            globalObject: "this",
            libraryTarget: "commonjs",
            path: resolve(__dirname, "./dist"),
        },


        optimization: {
            concatenateModules: true,
            mergeDuplicateChunks: true,
            minimize: buildMode === "production",
            ...(buildMode === "production" ? { minimizer: [
                new MinifyPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ] } : {}),
            chunkIds: "total-size",
            moduleIds: "size",
            providedExports: true,
            removeAvailableModules: true,
            removeEmptyChunks: true,
            sideEffects: true,
        },


        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    loader: "babel-loader",
                    sideEffects: false,
                },
                {
                    test: /\.sql/,
                    type: "asset/resource",
                },
            ],
        },


        node: {
            __dirname: false,
            __filename: false,
        },


        plugins: [
            new webpack.DefinePlugin({
                "process.env.BABEL_ENV":
                    JSON.stringify(buildMode),
                "process.env.GIT_AUTHOR_DATE":
                    JSON.stringify(git("log -1 --format=%aI")),
                "process.env.GIT_VERSION":
                    JSON.stringify(git("describe --always")),
                "process.env.VARS": JSON.stringify(vars),
            }),
            new ESLintPlugin({
                context: "src",
            }),
        ],

    };

};




// ...
module.exports = webpackAsyncConfig();
