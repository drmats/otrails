#!/bin/node
/**
 * Copy static assets to `dist` directory.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

/* eslint-disable no-console */

"use strict";

// ...
const { deepCopySync } = require("@xcmats/otrails-common/scripts/lib");




// ...
const main = () => {

    const
        srcDir = "static",
        distDir = "dist";

    console.info("Copying static files ...");

    // copy all files except topmost "index.template.html"
    // which html-webpack-plugin will take care of
    deepCopySync(
        srcDir,
        distDir,
        (de, level) => level !== 0 || de.name !== "index.template.html",
    );

    console.info("OK.");

};




// ...
if (require.main === module) void main();
