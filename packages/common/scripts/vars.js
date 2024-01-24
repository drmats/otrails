/**
 * Build-time variables db.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

/* eslint-disable no-console */

"use strict";

// ...
const
    { join } = require("node:path"),
    { readFile, unlink, writeFile } = require("node:fs/promises"),
    { bytesToString, stringToBytes } = require("@xcmats/js-toolbox/codec"),
    { isString } = require("@xcmats/js-toolbox/type"),

    DBFILE = "../../../data/vars.json",
    DB = join(__dirname, DBFILE);




// ...
const dbStringify = (db) => JSON.stringify(
    Object
        .keys(db)
        .sort()
        .reduce((acc, el) => Object.assign(
            acc, { [el]: db[el] },
        ), {}),
    undefined, 4,
);




// ...
const readVars = async () => {
    try { return JSON.parse(bytesToString(await readFile(DB))); }
    catch { return {}; }
};




// ...
const resetVars = async () => {
    try { await unlink(DB); } catch { /* no-op */ }
};




// ...
const writeVar = async (key, val) => {
    let v = val;
    try { v = JSON.parse(val); } catch { /* no-op */ }
    await writeFile(
        DB,
        stringToBytes(dbStringify({
            ...(await readVars()),
            ...{ [key]: v },
        })),
    );
};




// ...
const getVar = async (key) => (await readVars())[key];




// ...
const deleteVar = async (key) => {
    const currentDb = await readVars();
    delete currentDb[key];
    await writeFile(DB, stringToBytes(dbStringify(currentDb)));
};




// ...
const main = async () => {

    const op = isString(process.argv[2]) ? process.argv[2].toLowerCase() : "";

    if (op === "reset") {
        await resetVars();
        console.log("Reset OK.");
    } else if (op === "set" && process.argv.length === 5) {
        await writeVar(process.argv[3], process.argv[4]);
        console.log(process.argv[3], "->", await getVar(process.argv[3]));
    } else if (op === "unset" || op === "del" && process.argv.length === 4) {
        await deleteVar(process.argv[3]);
        console.log(process.argv[3], "deleted");
    } else if (
        (op === "get" && process.argv.length === 3) ||
        process.argv.length === 2
    ) {
        console.log(await readVars());
    } else if (op === "get" && process.argv.length === 4) {
        console.log(await getVar(process.argv[3]));
    }

    process.exit(0);

};




// ...
exports.readVars = readVars;




// ...
if (require.main === module) void main();
