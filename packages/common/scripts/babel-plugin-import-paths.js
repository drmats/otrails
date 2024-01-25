/**
 * Simple import path replacer:
 *
 * IN:
 * ```
 * import myQuery from "../some/path/to/query.sql"
 * ```
 *
 * OUT:
 * ```
 * const myQuery = "../some/path/to/query.sql"
 * ```
 *
 * @module @xcmats/node-sql-utils
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

"use strict";

// ...
const

    { extname } = require("node:path"),
    { partial } = require("@xcmats/js-toolbox/func"),
    { empty } = require("@xcmats/js-toolbox/string"),
    { access } = require("@xcmats/js-toolbox/struct"),

    defaults = {
        extensions: ["sql"],
    };




// import statement transformation
function transformImport (t, p, state) {
    const
        ext = extname(p.node.source.value),
        opts = Object.assign({}, defaults, state.opts);

    let variableName = null;


    if (opts.extensions.indexOf(ext.slice(1)) !== -1) {

        try {

            variableName = access(
                p, ["node", "specifiers", 0, "local", "name"], empty(),
            );

            p.replaceWith(
                t.variableDeclaration("const", [
                    t.variableDeclarator(
                        t.identifier(variableName),
                        t.stringLiteral(p.node.source.value)),
                ]),
            );

        } catch (ex) {

            throw p.buildCodeFrameError(ex.message);

        }

    }

}




// plugin entry-point
module.exports = function ({ types: t }) {
    return {
        visitor: {
            ImportDeclaration: partial(transformImport)(t),
        },
    };
};
