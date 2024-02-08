/**
 * Application variables.
 *
 * @module @xcmats/express-env
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { publicPath } from "~service/../package.json";




/**
 * @constant {String} rootPath Path prefix
 */
export const rootPath = publicPath;




/**
 * @constant {String} apiRoot Root for all REST API paths.
 */
export const apiRoot = `${rootPath}api`;




/**
 * @constant {String} apiV1 Where to send all queries?
 */
export const apiV1 = `${apiRoot}/v1`;
