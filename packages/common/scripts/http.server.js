#!/bin/node
/**
 * Serve static files.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable no-console */

"use strict";

// ...
const
    http = require("node:http"),
    express = require("express");




// ...
const main = () => {

    const
        app = express(),
        server = http.createServer(app),
        serviceAddress = "0.0.0.0",
        servicePort = Number(process.argv[2] ?? 8000);

    // simple logger
    app.use((req, res, next) => {
        console.info(`${req.ip} ${req.method} ${req.url} ${res.statusCode}`);
        return next();
    });

    // static file server
    app.use("/", express.static("./", {
        dotfiles: "ignore",
        index: ["index.html"],
    }));

    // listening
    server.listen(
        servicePort, serviceAddress,
        () => console.info(`Serving HTTP on ${serviceAddress} port ${servicePort} ...`),
    );

};




// ...
if (require.main === module) void main();
