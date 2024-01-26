/**
 * Zip-file format tools (yauzl-based).
 *
 * @module @xcmats/zip
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import yauzl, { type Entry, type ZipFile } from "yauzl";

import { ensureDirectory } from "~common/lib/fs";
import { createTimedBarrier } from "~common/lib/async";




/**
 * Extract `source` zip to `destination` directory.
 */
export const extract = async (opts: {
    source: string;
    destination: string;
    timeout?: number;
    onEntry?: (
        entry:
            & Pick<Entry, "fileName">
            & Pick<ZipFile, "entriesRead" | "entryCount">,
    ) => void;
    onClose?: () => void;
}): Promise<void> => {
    // barrier - yauzl is not promisified
    const barrier = createTimedBarrier<void>(opts.timeout);

    // invoke decompression
    yauzl.open(
        opts.source,

        { lazyEntries: true, autoClose: true },

        (err, zipfile) => {
            if (err) throw err;

            zipfile.on("close", () => {
                if (opts.onClose) opts.onClose();
                barrier.resolve();
            });

            zipfile.on("entry", (entry: Entry) => {
                if (opts.onEntry) opts.onEntry({
                    entriesRead: zipfile.entriesRead,
                    entryCount: zipfile.entryCount,
                    fileName: entry.fileName,
                });

                const dst = join(opts.destination, entry.fileName);

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
    return barrier.lock();
};
