/**
 * CORS headers configuration.
 *
 * @module @xcmats/express-cors
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

import { useMemory } from "~service/logic/memory";
import { name as appName, version } from "~service/../package.json";




/**
 * Headers configuration.
 */
export default function configureHeaders (): void {

    const { app } = useMemory();

    app.use((_req, res, next) => {

        res.header({
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": [
                "Accept-Language",
                "Accept",
                "Authorization",
                "Cache-Control",
                "Connection",
                "Content-Disposition",
                "Content-Language",
                "Content-Type",
                "DNT",
                "Host",
                "If-Modified-Since",
                "Origin",
                "Pragma",
                "Range",
                "Referer",
                "User-Agent",
                "X-Access-Token",
                "X-Requested-With",
            ].join(", "),
            "Access-Control-Allow-Methods": "HEAD, GET, OPTIONS, POST",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": [
                "Cache-Control",
                "Content-Disposition",
                "Content-Language",
                "Content-Length",
                "Content-Type",
                "Date",
                "ETag",
                "Expires",
                "Last-Modified",
                "Pragma",
                "X-Powered-By",
            ].join(", "),
            "Access-Control-Max-Age": "86400",
            "X-Powered-By": `${appName}-${version}`,
        });

        return next();

    });

}
