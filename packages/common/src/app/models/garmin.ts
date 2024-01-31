/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { isNumber, isString } from "@xcmats/js-toolbox";

import { isPlainRecord } from "~common/lib/struct";
import { orUndefined } from "~common/lib/type";




/**
 * https://www.garmin.com/en-US/account/datamanagement/exportdata/
 */
export const exportDataStructure = {

    fitnessDir: "DI_CONNECT/DI-Connect-Fitness/",
    summaryFilePattern: /^.*summarizedActivities\.json$/,
    imagesFilePattern: /^.*activityImages\.json$/,

    tracksDir: "DI_CONNECT/DI-Connect-Uploaded-Files/",
    imagesDir: "_OTRAILS_IMAGES/",

} as const;




/**
 * Garmin's "activity image" object shape.
 */
export type ActivityImage = {
    imageId: string;
    activityId: number;
    sortOrder: number;
    url: string;
    latitude?: number;
    longitude?: number;
    photoDate?: string;
    reviewStatusId?: number;
};




/**
 * ActivityImage type predicate.
 */
export const isActivityImage = (c: unknown): c is ActivityImage =>
    isPlainRecord(c) &&
    isString(c.imageId) &&
    isNumber(c.activityId) &&
    isString(c.url) &&
    orUndefined(isNumber) (c.latitude) &&
    orUndefined(isNumber) (c.longitude) &&
    orUndefined(isString) (c.photoDate) &&
    orUndefined(isNumber) (c.reviewStatusId);
