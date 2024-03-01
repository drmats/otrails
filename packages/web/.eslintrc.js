/**
 * ESLint web (ts/tsx/js/jsx) configuration.
 *
 * @module @xcmats/eslint-web-config
 * @license BSD-2-Clause
 * @copyright Mat. 2018-present
 */

"use strict";

// ...
const

    { realpathSync } = require("node:fs"),
    { resolve } = require("node:path"),
    appDirectory = realpathSync(process.cwd());




// ...
module.exports = {

    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },


    "parser": "@babel/eslint-parser",


    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
        },
        "ecmaVersion": "latest",
        "sourceType": "module",
    },


    "extends": [
        "eslint:recommended",
    ],


    "plugins": [
        "import",
        "react",
        "react-hooks",
    ],


    "root": true,


    "rules": {
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "exports": "always-multiline",
                "functions": "always-multiline",
                "imports": "always-multiline",
                "objects": "always-multiline",
            },
        ],
        "import/first": "error",
        "import/no-amd": "error",
        "import/no-webpack-loader-syntax": "error",
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        "no-console": "warn",
        "no-dupe-args": "error",
        "no-dupe-class-members": "error",
        "no-dupe-keys": "error",
        "no-redeclare": "error",
        "no-undef": "error",
        "no-unexpected-multiline": "error",
        "no-unused-vars": ["warn", { "args": "all", "argsIgnorePattern": "^_" }],
        "object-curly-newline": "off",
        "object-curly-spacing": ["error", "always"],
        "prefer-const": "warn",
        "quotes": ["error", "double"],
        "react/forbid-foreign-prop-types": "error",
        "react/jsx-closing-bracket-location": ["error", "line-aligned"],
        "react/jsx-indent-props": ["error", 4],
        "react/jsx-no-duplicate-props": ["error", { "ignoreCase": false }],
        "react/jsx-no-undef": "error",
        "react/jsx-tag-spacing": ["error", { "beforeSelfClosing": "always" }],
        "react/jsx-uses-react": "off",
        "react/jsx-uses-vars": "error",
        "react/no-direct-mutation-state": "error",
        "react/react-in-jsx-scope": "off",
        "react/require-render-return": "error",
        "react/sort-prop-types": ["error", {
            "ignoreCase": false,
            "callbacksLast": true,
            "requiredFirst": true,
        }],
        "react/style-prop-object": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": ["warn"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", "always"],
        "strict": "off",
    },


    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],
            "parser": "@typescript-eslint/parser",
            "parserOptions": {
                "project": true,
                "tsconfigRootDir": __dirname,
            },
            "extends": [
                "plugin:@typescript-eslint/recommended-type-checked",
                "plugin:@typescript-eslint/stylistic-type-checked",
            ],
            "plugins": [
                "@typescript-eslint",
            ],
            "rules": {
                "@typescript-eslint/comma-dangle": [
                    "error",
                    {
                        "arrays": "always-multiline",
                        "enums": "always-multiline",
                        "exports": "always-multiline",
                        "functions": "always-multiline",
                        "generics": "always-multiline",
                        "imports": "always-multiline",
                        "objects": "always-multiline",
                        "tuples": "always-multiline",
                    },
                ],
                "@typescript-eslint/consistent-indexed-object-style": "off",
                "@typescript-eslint/consistent-type-definitions": "off",
                "@typescript-eslint/explicit-module-boundary-types": ["warn"],
                "@typescript-eslint/indent": "off",
                "@typescript-eslint/interface-name-prefix": "off",
                "@typescript-eslint/member-delimiter-style": "error",
                "@typescript-eslint/no-empty-function": "warn",
                "@typescript-eslint/no-misused-promises": [
                    "error", { "checksVoidReturn": false },
                ],
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-redundant-type-constituents": "off",
                "@typescript-eslint/no-unused-vars": [
                    "warn", { "args": "all", "argsIgnorePattern": "^_" },
                ],
                "@typescript-eslint/require-await": "off",
                "@typescript-eslint/semi": ["error", "always"],
                "@typescript-eslint/unbound-method": "off",

                "comma-dangle": "off",
                "no-unused-vars": "off",
                "prefer-const": "warn",
                "require-await": "off",
                "semi": "off",
            },
        },
    ],


    "settings": {
        "import/resolver": {
            "alias": {
                "map": [
                    ["~common", resolve(appDirectory, "..", "common", "src")],
                    ["~web", resolve(appDirectory, "src")],
                ],
            },
        },

        "react": {
            "pragma": "React",
            "version": "detect",
        },
    },

};
