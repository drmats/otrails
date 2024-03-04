/**
 * Bundle configuration - web (prod).
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
    MinifyPlugin = require("terser-webpack-plugin"),
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
            backend: vars.backend_prod,
            path: vars.path_prod,
        });


    return {

        mode: "production",


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
            minimize: true,
            minimizer: [
                new MinifyPlugin({
                    terserOptions: {
                        output: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                }),
            ],
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
                        /node_modules\/maplibre-gl/,
                        /node_modules\/react-dom/,
                        /node_modules\/react-redux/,
                    ],
                    sideEffects: false,
                },
                {
                    test: /\.(css)$/i,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },


        plugins: [
            new webpack.EnvironmentPlugin({
                BABEL_ENV: "production",
                DEBUG: false,
                GIT_AUTHOR_DATE: git("log -1 --format=%aI"),
                GIT_VERSION: git("describe --always"),
                NODE_ENV: "production",
                VARS: frontendVars,
            }),
            new ESLintPlugin({
                context: "src",
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                inject: "body",
                hash: true,
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
                title: appName,
                template: resolve(
                    appDirectory, "static/index.template.html",
                ),
            }),
        ],

    };
};




// ...
module.exports = webpackAsyncConfig();
