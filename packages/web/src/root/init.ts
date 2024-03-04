/**
 * Init logic.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

import { share } from "mem-box";
import forage from "localforage";
import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";
import dayjsIsoWeek from "dayjs/plugin/isoWeek";
import dayjsLocaleData from "dayjs/plugin/localeData";
import dayjsLocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsToObject from "dayjs/plugin/toObject";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsWeekday from "dayjs/plugin/weekday";

import type { ThunkDispatch } from "~web/store/types";
import { createReduxStore } from "~web/store/setup";
import { devConsole, exposeDevNamespace } from "~web/root/dev";
import { appMemory } from "~web/root/memory";
import { i18nSetup } from "~web/layout/localization";
import { setBackendAddress } from "~web/network/utils";
import packageInfo from "~web/../package.json";




/**
 * User Interface - entry point.
 * Can be invoked on server (while statics are generated) and client-side.
 */
export default function init (): ({
    clientEntry: () => Promise<void>;
    ctx: Ctx;
    store: ReturnType<typeof createReduxStore>;
}) {

    const

        // app memory - volatile, imperative context/storage
        ctx = appMemory(),

        // mutable subcontext
        mut = {};

    // share mutable subcontext
    share({ mut });

    // dayjs configuration with plugins
    dayjs.extend(dayjsUtc);
    dayjs.extend(dayjsDuration);
    dayjs.extend(dayjsIsoWeek);
    dayjs.extend(dayjsLocaleData);
    dayjs.extend(dayjsLocalizedFormat);
    dayjs.extend(dayjsRelativeTime);
    dayjs.extend(dayjsTimezone);
    dayjs.extend(dayjsToObject);
    dayjs.extend(dayjsWeekday);

    // share configured dayjs instance
    share({ dayjs });

    // redux store with custom middlewares, listeners and rehydration
    const store = createReduxStore();

    // share application-specific variables
    share({ dispatch: store.dispatch, forage, store });

    return {

        // should be invoked just on the client-side
        clientEntry: async () => {

            // set build-time-configured backend address
            setBackendAddress();

            // console logger - more sophisticated logger should be set-up here
            const logger = devConsole();

            // share application-specific variables (client-only)
            share({ logger });

            // initialize translation subsystem
            await i18nSetup();

            // greet
            logger.info(`Boom! 💥 - ${packageInfo.name}`);

            // expose dev. namespace and some convenience shortcuts
            await exposeDevNamespace();

            // set window title
            const title = document.getElementsByTagName("title").item(0);
            if (title) title.innerText = packageInfo.name;

        },

        // ...
        ctx,

        // ...
        store,

    };

}




/**
 * Global declaration merge.
 */
declare global {

    /**
     * DOM window
     */
    interface Window {
        [key: string]: unknown;
    }

    /**
     * Mutable subcontext.
     */
    interface Mut { }

    /**
     * Shared memory context.
     */
    interface Ctx {
        readonly dayjs: typeof dayjs;
        readonly dispatch: ThunkDispatch;
        readonly forage: typeof forage;
        readonly logger: Console;
        readonly mut: Mut;
        readonly store: ReturnType<typeof createReduxStore>;
    }

}
