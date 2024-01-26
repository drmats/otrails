/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import yauzl, { type Entry } from "yauzl";
import { padRight, shorten } from "@xcmats/js-toolbox/string";
import { isString } from "@xcmats/js-toolbox/type";

import type { CliAction } from "~common/framework/actions";
import { useMemory } from "~cli/setup/main";
import { ensureDirectory } from "~common/lib/fs";
import { infonl, progress } from "~common/lib/terminal";
import { printError } from "~common/lib/error";
import { createTimedBarrier } from "~common/lib/async";




/**
 * Uncompress contents of garmin export.
 */
export const extractGarminData: CliAction<{
    name?: string;
    id?: string;
}> = async ({ name, id }) => {

    const { pgp, vars } = useMemory();

    // extract process configuration variables
    const { exportsDir, extractsDir } = vars;

    try {

        // check variables validity
        if (!isString(exportsDir) || !isString(extractsDir)) {
            throw new Error("Missing or malformad export/extract variables.");
        }

        // check arguments validity
        if (!isString(name) || !isString(id)) {
            throw new Error("Provide [name] and [id].");
        }

        // destination directory
        const dstDir = join(extractsDir, id);

        // barrier - yauzl is not promisified
        const barrier = createTimedBarrier<void>();

        // invoke decompression
        yauzl.open(
            join(exportsDir, name),
            { lazyEntries: true },
            (err, zipfile) => {
                if (err) throw err;
                zipfile.on("close", () => { infonl(); barrier.resolve(); });
                zipfile.on("entry", (entry: Entry) => {
                    progress(
                        zipfile.entriesRead, zipfile.entryCount,
                        shorten(padRight(entry.fileName, 60), 60),
                    );
                    const dst = join(dstDir, entry.fileName);
                    if (entry.fileName.endsWith("/")) {
                        ensureDirectory(dst)
                            .then(() => { zipfile.readEntry(); })
                            .catch((e) => { throw e; });
                    } else {
                        zipfile.openReadStream(entry, (err, readStream) => {
                            if (err) throw err;
                            ensureDirectory(dirname(dst))
                                .then(() => {
                                    const writeStream = createWriteStream(dst);
                                    writeStream.on(
                                        "close",
                                        () => { zipfile.readEntry(); },
                                    );
                                    readStream.pipe(writeStream);
                                })
                                .catch((e) => { throw e; });
                        });
                    }
                });
                zipfile.readEntry();
            },
        );

        // wait for yauzl to finish
        await barrier.lock();

    } catch (e) {
        printError(e);
        process.exit(1);
    }

    return pgp.end();

};
