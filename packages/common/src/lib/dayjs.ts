/**
 * Various date/time utilities (using dayjs library).
 *
 * @module @xcmats/dayjs
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { Dayjs } from "dayjs";
import { capitalize } from "@xcmats/js-toolbox/string";
import { timeUnit } from "@xcmats/js-toolbox/utils";

import { NDASH, NBSP } from "~common/lib/string";




/**
 * Get time from `top` and put it over `base`.
 */
export const timeOnDate = (base: Dayjs, top: Dayjs): Dayjs =>
    base
        .hour(top.hour()).minute(top.minute())
        .second(top.second()).millisecond(top.millisecond());




/**
 * Is it midnight?
 */
export const isMidnight = (ts: Dayjs): boolean =>
    ts.hour() === 0 &&
    ts.minute() === 0 &&
    ts.second() === 0;




/**
 * Truncate input timestamp a date precision.
 */
export const dateTrunc = (ts: Dayjs): Dayjs =>
    ts.hour(0).minute(0).second(0).millisecond(0);




/**
 * Check if given timestamp is just a date.
 */
export const isDateTrunc = (ts: Dayjs): boolean =>
    ts.hour() === 0 &&
    ts.minute() === 0 &&
    ts.second() === 0 &&
    ts.millisecond() === 0;




/**
 * Truncate input timestamp to beginning-of-date - "range start"
 * (strip hours, minutes, seconds and set milliseconds to 1).
 */
export const dateTruncLow = (ts: Dayjs): Dayjs =>
    ts.hour(0).minute(0).second(0).millisecond(1);




/**
 * Check if given timestamp is a beginning-of-date.
 */
export const isDateTruncLow = (ts: Dayjs): boolean =>
    ts.hour() === 0 &&
    ts.minute() === 0 &&
    ts.second() === 0 &&
    ts.millisecond() === 1;




/**
 * Truncate input timestamp to end-of-date - "range end".
 */
export const dateTruncHigh = (ts: Dayjs): Dayjs =>
    ts.hour(23).minute(59).second(59).millisecond(999);




/**
 * Check if given timestamp is a beginning-of-date.
 */
export const isDateTruncHigh = (ts: Dayjs): boolean =>
    ts.hour() === 23 &&
    ts.minute() === 59 &&
    ts.second() === 59 &&
    ts.millisecond() === 999;




/**
 * Truncate input timestamp to time without seconds and milliseconds.
 */
export const wholeTimeTrunc = (ts: Dayjs): Dayjs =>
    ts.second(0).millisecond(0);




/**
 * Truncate input timestamp to time without minutes, seconds and milliseconds.
 */
export const wholeHoursTrunc = (ts: Dayjs): Dayjs =>
    ts.minute(0).second(0).millisecond(0);




/**
 * Truncate input timestamp to month precision.
 */
export const wholeMonthTrunc = (ts: Dayjs): Dayjs =>
    ts.date(1).hour(0).minute(0).second(0).millisecond(0);




/**
 * Truncate input timestamp to year precision.
 */
export const wholeYearTrunc = (ts: Dayjs): Dayjs =>
    ts.month(0).date(1).hour(0).minute(0).second(0).millisecond(0);




/**
 * Human readable date as string.
 */
export const humanDate = (
    ts: Dayjs,
    opts?: {
        sep?: string;
        shortDayName?: boolean;
    },
): string =>
    [
        ts.format("D"),
        capitalize(ts.format("MMMM")),
        `(${capitalize(ts.format(opts?.shortDayName ? "ddd" : "dddd"))})`,
    ].join(opts?.sep ?? " ");




/**
 * Human readable date as short string.
 */
export const humanShortDate = (ts: Dayjs): string => ts.format("l");




/**
 * Human readable time range as string.
 */
export const humanTimeRange = (start: Dayjs, end: Dayjs): string =>
    `${start.format("LT")}${NBSP}${NDASH}${NBSP}${end.format("LT")}`;




/**
 * Human readable datetime as short string.
 */
export const humanDateTime = (ts: Dayjs): string =>
    `${ts.format("l")}${NBSP}${ts.format("LT")}`;




/**
 * Human readable range string (start - end) and helper variables.
 */
export const humanDateRange = (
    eventStart: Dayjs,
    eventEnd: Dayjs,
    opts?: {
        shortDayNames?: boolean;
    },
): {
    eventDuration: number;
    humanEnd: string;
    humanRange: string;
    humanStart: string;
    isOneDay: boolean;
    isShorterThanDay: boolean;
    rangeString: string;
} => {
    const
        eventDuration = eventEnd.diff(eventStart),
        isShorterThanDay =
            Math.abs(eventDuration) <
                timeUnit.day - 1 * timeUnit.minute,
        isOneDay =
            Math.abs(eventDuration) >=
                timeUnit.day - 1 * timeUnit.minute &&
            Math.abs(eventDuration) < timeUnit.day,
        humanStart = humanDate(eventStart, { shortDayName: opts?.shortDayNames }),
        humanEnd = humanDate(eventEnd, { shortDayName: opts?.shortDayNames }),
        humanRange = humanTimeRange(eventStart, eventEnd),
        rangeString =
            isShorterThanDay
                ? `${humanStart}, ${humanRange}`
                : isOneDay
                    ? humanStart
                    : `${humanStart}${NBSP}${NDASH}${NBSP}${humanEnd}`;

    return {
        eventDuration,
        humanEnd,
        humanRange,
        humanStart,
        isOneDay,
        isShorterThanDay,
        rangeString,
    };
};
