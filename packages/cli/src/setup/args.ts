/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { emptyObject } from "~common/lib/type";
import { dbSize } from "~cli/actions/dbSize";
import { devConsole } from "~cli/actions/dev";
import { extractGarminData } from "~cli/actions/extractGarminData";
import { fetchImages } from "~cli/actions/fetchImages";
import { hello } from "~cli/actions/hello";




/**
 * Argument parsing.
 */
export default async function configureArgsParser (): Promise<void> {

    // command line option parser - routing
    await yargs(hideBin(process.argv))
        .scriptName("cli")

        // "hello world" - database connection and version check
        .command(
            "hello",
            "database connection and versions",
            emptyObject,
            hello,
        )

        // development cli
        .command(
            "dev [cwd]",
            "development console",
            {
                cwd: {
                    type: "string",
                    default: ".",
                    describe: "working directory",
                },
            },
            devConsole,
        )

        // check database size
        .command(
            "db-size [name]",
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

        // export contents of garmin data export zip to id-subfolder
        .command(
            "extract-garmin-data [zipFileName] [userShortId]",
            "uncompress contents of garmin export",
            {
                zipFileName: {
                    type: "string",
                    describe: "garmin data export zip",
                },
                userShortId: {
                    type: "string",
                    describe: "destination subfolder",
                },
            },
            extractGarminData,
        )

        // image retriever
        .command(
            "fetch-images [userShortId]",
            "dfetch all export-data images",
            {
                userShortId: {
                    type: "string",
                    describe: "destination subfolder",
                },
            },
            fetchImages,
        )

        .strict()
        .demandCommand()
        .help()
        .wrap(120)
        .epilog("Visit https://wchmurach.com.pl/")
        .argv;

}
