/**
 * Bundle configuration - web (dev).
 *
 * @module @xcmats/webpack-web-config
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

"use strict";

// ...
const

    { realpathSync } = require("node:fs"),
    { resolve } = require("node:path"),
    webpack = require("webpack"),
    ESLintPlugin = require("eslint-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    { git } = require("@xcmats/otrails-common/scripts/lib"),
    { readVars } = require("@xcmats/otrails-common/scripts/vars"),
    appName = require("./package.json").name,
    appDirectory = realpathSync(process.cwd());




// ...
const webpackAsyncConfig = async () => {

    const
        vars = await readVars(),
        frontendVars = JSON.stringify({
            backend: vars.backend_dev,
            path: vars.path_dev,
        });


    return {

        mode: "development",


        target: "web",


        resolve: {
            extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
            alias: {
                "~common": resolve(appDirectory, "..", "common"),
                "~web": resolve(appDirectory, "src"),
            },
        },


        entry: {
            [appName.split("/")[1]]: resolve(appDirectory, "src/index.ts"),
        },


        output: {
            library: {
                name: appName.split("/")[1],
                type: "window",
            },
            filename: "[name].js",
            chunkFilename: "[contenthash].js",
            globalObject: "this",
            path: resolve(__dirname, "./dist"),
            clean: true,
        },


        optimization: {
            concatenateModules: true,
            mergeDuplicateChunks: true,
            minimize: false,
            chunkIds: "total-size",
            moduleIds: "size",
            providedExports: true,
            removeAvailableModules: false,
            removeEmptyChunks: true,
            sideEffects: true,
        },


        performance: {
            maxEntrypointSize: 512*1024,
            maxAssetSize: 1024*1024,
        },


        module: {
            rules: [
                {
                    test: /\.(js|ts|jsx|tsx)$/,
                    loader: "babel-loader",
                    exclude: [
                        /node_modules\/react-dom/,
                        /node_modules\/react-redux/,
                    ],
                    sideEffects: false,
                },
            ],
        },


        plugins: [
            new webpack.EnvironmentPlugin({
                BABEL_ENV: "development",
                DEBUG: true,
                GIT_AUTHOR_DATE: git("log -1 --format=%aI"),
                GIT_VERSION: git("describe --always"),
                NODE_ENV: "development",
                VARS: frontendVars,
            }),
            new ESLintPlugin({
                context: "src",
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                inject: "body",
                hash: true,
                minify: false,
                title: appName,
                template: resolve(
                    appDirectory, "static/index.template.html",
                ),
            }),
        ],


        devServer: {
            allowedHosts: "all",
            compress: true,
            host: "0.0.0.0",
            hot: false,
            liveReload: true,
            open: false,
            port: 8000,
            static: {
                directory: resolve(__dirname, "static"),
            },
        },

    };
};




// ...
module.exports = webpackAsyncConfig();
