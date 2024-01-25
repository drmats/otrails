/**
 * Otrails - trails, ours.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { emptyObject } from "~common/lib/type";
import { dbSize } from "~cli/actions/dbSize";
import { hello } from "~cli/actions/hello";




/**
 * Argument parsing.
 */
export default function configureArgsParser (): void {

    // command line option parser - routing
    void yargs(hideBin(process.argv))
        .scriptName("otrails-cli")

        // "hello world" - connection and version check
        .command(
            "hello",
            "check database connection and print versions",
            emptyObject,
            hello,
        )

        // check database size
        .command(
            "dbSize [name]",
            "check database size",
            {
                name: {
                    type: "string",
                    default: "otrails",
                    describe: "database name",
                },
            },
            dbSize,
        )

        .strict()
        .demandCommand()
        .help()
        .wrap(90)
        .epilog("Visit https://wchmurach.com.pl/")
        .argv;

}
