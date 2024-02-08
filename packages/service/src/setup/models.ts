/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { share } from "mem-box";

import { useMemory } from "~service/logic/memory";
import { recordKeys } from "~common/lib/struct";
import setting, { schema as settingSchema } from "~service/models/setting";




/**
 * Application models configuration.
 */
export default function configureModels (
    opts?: { execSchemas?: boolean },
): void {

    // database handle
    const { db, firstWorker, logger } = useMemory();

    // all schemas tree
    const schema = {
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
            readonly setting: ReturnType<typeof setting>;
        };
    }
}
