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
import { processFits } from "~cli/actions/processFits";
import { processSummaries } from "~cli/actions/processSummaries";
import { processTcxes } from "~cli/actions/processTcxes";
import { setupViews } from "~cli/actions/setupViews";




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
            "fetch all export-data images",
            {
                userShortId: {
                    type: "string",
                    describe: "data subfolder",
                },
            },
            fetchImages,
        )

        // summarized activities processor
        .command(
            "process-summaries [userShortId]",
            "process summarized activities",
            {
                userShortId: {
                    type: "string",
                    describe: "data subfolder",
                },
            },
            processSummaries,
        )

        // tcx-file activities processor
        .command(
            "process-tcxes [userShortId]",
            "process tcx-file activities",
            {
                userShortId: {
                    type: "string",
                    describe: "data subfolder",
                },
            },
            processTcxes,
        )

        // fit-file activities processor
        .command(
            "process-fits [userShortId]",
            "process fit-file activities",
            {
                userShortId: {
                    type: "string",
                    describe: "data subfolder",
                },
            },
            processFits,
        )

        // database views
        .command(
            "setup-views",
            "database views setup",
            emptyObject,
            setupViews,
        )

        .strict()
        .demandCommand()
        .help()
        .wrap(120)
        .epilog("Visit https://wchmurach.com.pl/")
        .argv;

}
