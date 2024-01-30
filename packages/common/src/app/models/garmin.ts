/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */




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
