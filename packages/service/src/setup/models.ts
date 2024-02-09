/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { share } from "mem-box";

import { useMemory } from "~service/logic/memory";
import { recordKeys } from "~common/lib/struct";
import mbtile, { schema as mbtileSchema } from "~service/models/mbtile";
import setting, { schema as settingSchema } from "~service/models/setting";




/**
 * Application models configuration.
 */
export default async function configureModels (
    opts?: { execSchemas?: boolean },
): Promise<void> {

    // database handle
    const { db, firstWorker, logger } = useMemory();

    // all schemas tree
    const schema = {
        mbtile: mbtileSchema,
        setting: settingSchema,
    };

    // schemas init
    if (firstWorker) logger.write("[models] ... ");
    recordKeys(schema).forEach((k) => {
        if (firstWorker) logger.writeContinue(`${k}`);
        if (opts?.execSchemas) {
            db.exec(schema[k]());
            if (firstWorker) logger.writeContinue("! ");
        } else {
            if (firstWorker) logger.writeContinue(" ");
        }
    });
    if (firstWorker) logger.writeContinue("... ");

    // all models tree
    const model = {
        mbtile: await mbtile(db),
        setting: setting(db),
    };

    // share it
    share({ model });

    if (firstWorker) logger.ok("OK");

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        readonly model: {
            readonly mbtile: Awaited<ReturnType<typeof mbtile>>;
            readonly setting: ReturnType<typeof setting>;
        };
    }
}
