/**
 * Dayjs configuration.
 *
 * @module @xcmats/dayjs-config
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";
import dayjsIsoWeek from "dayjs/plugin/isoWeek";
import dayjsLocaleData from "dayjs/plugin/localeData";
import dayjsLocaleEN from "dayjs/locale/en";
import dayjsLocalePL from "dayjs/locale/pl";
import dayjsLocalizedFormat from "dayjs/plugin/localizedFormat";
import dayjsRelativeTime from "dayjs/plugin/relativeTime";
import dayjsTimezone from "dayjs/plugin/timezone";
import dayjsToObject from "dayjs/plugin/toObject";
import dayjsUtc from "dayjs/plugin/utc";
import dayjsWeekday from "dayjs/plugin/weekday";
import type { Locale } from "dayjs/locale/en";
import { share } from "mem-box";

import { useMemory } from "~service/logic/memory";
import { ThemeLanguage } from "~common/framework/language";




/**
 * Dayjs configuration with plugins.
 */
export default function configureDayjs (): void {

    // app objects
    const { firstWorker, logger } = useMemory();

    if (firstWorker) logger.write("[dayjs] ... ");

    dayjs.extend(dayjsUtc);
    dayjs.extend(dayjsDuration);
    dayjs.extend(dayjsIsoWeek);
    dayjs.extend(dayjsLocaleData);
    dayjs.extend(dayjsLocalizedFormat);
    dayjs.extend(dayjsRelativeTime);
    dayjs.extend(dayjsTimezone);
    dayjs.extend(dayjsToObject);
    dayjs.extend(dayjsWeekday);

    // date/time localizations
    const dayjsLocales = {
        [ThemeLanguage.EN]: dayjsLocaleEN as Locale,
        [ThemeLanguage.PL]: dayjsLocalePL as Locale,
    } as const;

    share({ dayjs, dayjsLocales });

    if (firstWorker) logger.ok("OK");

}




/**
 * Shared memory type augmentation.
 */
declare global {
    interface Ctx {
        readonly dayjs: typeof dayjs;
        readonly dayjsLocales: Record<ThemeLanguage, Locale>;
    }
}
