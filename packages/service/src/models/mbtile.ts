/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { Database } from "better-sqlite3";

import { tileSourcesManager } from "~common/mbtiles/lib";
import { useMemory } from "~service/logic/memory";




/**
 * Mbtile model - schemaless.
 */
export const schema = () => "";




/**
 * Mbtile model.
 */
export default async function setting (_db: Database) {

    // variables
    const { knownVars } = useMemory();


    // mbtiles source manager
    const sources = await tileSourcesManager(knownVars.tilesDir);


    // ...
    const sql = {} as const;


    // ...
    const statement = {} as const;


    // ...
    const pub = {

        // ...
        getSourceNames: sources.getNames,

        // ...
        refreshSources: async (): Promise<string[]> => {
            await sources.refresh();
            return sources.getNames();
        },

        // ...
        get: sources.getTile,

        // ...
        getMeta: sources.getMeta,

        // ...
        getAllMeta: sources.getAllMeta,

        // ...
        closeAllSources: sources.close,

    } as const;


    return {
        ...pub,
        $: { sql, statement },
    } as const;

}
