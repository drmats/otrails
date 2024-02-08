/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import chalk from "chalk";

import { useMemory } from "~service/logic/memory";
import { gitVersion } from "~common/lib/dev";
import { name as applicationName, version } from "~service/../package.json";




/**
 * Listen and respond to requests.
 */
export const listen = (): void => {

    // shared application objects
    const {
        logger, server,
        knownVars: { serviceDb, servicePort },
    } = useMemory();

    // listen
    server.listen(
        servicePort, "0.0.0.0",
        () => setTimeout(() => logger.info(
            `${applicationName.split("/")[1]}:${chalk.yellow(servicePort)}`,
            `${chalk.blueBright("v." + version)}-${chalk.redBright(gitVersion())}`,
            `db:[${chalk.whiteBright(serviceDb)}]`,
            `pid:[${chalk.green(process.pid)}]`,
        ), 500),
    );

};
