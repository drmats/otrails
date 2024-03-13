/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { emptyObject } from "~common/lib/type";
import { bakeTiles } from "~cli/actions/bakeTiles";
import { dbSize } from "~cli/actions/dbSize";
import { devConsole } from "~cli/actions/dev";
import { extractGarminData } from "~cli/actions/extractGarminData";
import { fetchImages } from "~cli/actions/fetchImages";
import { hello } from "~cli/actions/hello";
import { ingestGarminData } from "~cli/actions/ingestGarminData";
import { initAllProxyTiles } from "~cli/actions/initAllProxyTiles";
import { initProxyTiles } from "~cli/actions/initProxyTiles";
import { prepareBaseMaps } from "~cli/actions/prepareBaseMaps";
import { processFits } from "~cli/actions/processFits";
import { processSummaries } from "~cli/actions/processSummaries";
import { processTcxes } from "~cli/actions/processTcxes";
import { setupViews } from "~cli/actions/setupViews";
import { wipeAllData } from "~cli/actions/wipeAllData";




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

        // wipe all postgis data
        .command(
            "wipe-all-data",
            "wipe all data from postgis database",
            emptyObject,
            wipeAllData,
        )

        // export contents of garmin data export zip to id-subfolder
        .command(
            "extract-garmin-data [zipFileName] [userShortId]",
            "(1) uncompress contents of garmin export",
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
            "(2) fetch all export-data images",
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
            "(3) process summarized activities",
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
            "(4) process tcx-file activities",
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
            "(5) process fit-file activities",
            {
                userShortId: {
                    type: "string",
                    describe: "data subfolder",
                },
            },
            processFits,
        )

        // automate:
        //     - extract-garmin-data
        //     - fetch-images
        //     - process-summaries
        //     - process-tcxes
        //     - process-fits
        .command(
            "ingest-garmin-data [zipFileName] [userShortId]",
            "ingest garmin user data (automate 5 steps)",
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
            ingestGarminData,
        )

        // database views
        .command(
            "setup-views",
            "database views setup",
            emptyObject,
            setupViews,
        )

        // tile baker
        .command(
            "bake-tiles",
            "bake mbtiles file",
            emptyObject,
            bakeTiles,
        )

        // base maps
        .command(
            "prepare-base-maps",
            "prepare base maps",
            emptyObject,
            prepareBaseMaps,
        )

        // tile proxy (single)
        .command(
            "init-proxy-tiles [name] [url]",
            "initialize named tile proxy",
            {
                name: {
                    type: "string",
                    describe: "tileset name",
                },
                url: {
                    type: "string",
                    describe: "original tile source url (scheme)",
                },
            },
            initProxyTiles,
        )

        // tile proxies (all)
        .command(
            "init-all-proxy-tiles",
            "initialize defined set of cached tile proxies",
            emptyObject,
            initAllProxyTiles,
        )

        .strict()
        .demandCommand()
        .help()
        .wrap(120)
        .epilog("Visit https://wchmurach.com.pl/")
        .argv;

}
