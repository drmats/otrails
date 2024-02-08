/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { infonl, notenl, warnnl } from "~common/lib/terminal";
import { useMemory } from "~cli/setup/memory";




/**
 * Process termination configuration.
 */
export default function configureTermination (): void {

    const { pgp } = useMemory();

    process.on("exit", (status: number) => {
        if (status !== 0) notenl("interrupted");
    });

    process.on("SIGHUP", () => {
        infonl();
        warnnl("SIGHUP");
        pgp.end();
        process.exit(1);
    });

    process.on("SIGINT", () => {
        infonl();
        warnnl("SIGINT");
        pgp.end();
        process.exit(1);
    });

    process.on("SIGTERM", () => {
        infonl();
        warnnl("SIGTERM");
        pgp.end();
        process.exit(1);
    });

}
