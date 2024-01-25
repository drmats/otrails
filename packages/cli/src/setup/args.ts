/**
 * Otrails - trails, ours.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/no-empty-function */

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { gitVersion } from "~common/lib/dev";
import { hello } from "~cli/actions/hello";




/**
 * Argument parsing.
 */
export default function configureArgsParser (): void {

    // command line option parser
    void yargs(hideBin(process.argv))
        .scriptName("otrails-cli")
        .command(
            "hello",
            "check database connection and print versions",
            () => {},
            hello,
        )
        .strict()
        .demandCommand()
        .help()
        .wrap(90)
        .epilog(`[${gitVersion()}] - Visit https://wchmurach.com.pl/`)
        .argv;

}
