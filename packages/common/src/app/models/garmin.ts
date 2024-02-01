/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import {
    isBoolean,
    isNumber,
    isString,
    undefinedToNull,
} from "@xcmats/js-toolbox/type";

import { isComplexRecord, isPlainRecord } from "~common/lib/struct";
import {
    orUndefined,
    type FreeFormRecord,
    type PlainValue,
} from "~common/lib/type";




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
    imageId:         string;
    activityId:      number /* int */;
    sortOrder:       number /* int */;
    url:             string;
    latitude?:       number /* real */;
    longitude?:      number /* real */;
    photoDate?:      string;
    reviewStatusId?: number /* int */;
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




/**
 * Garmin's "summarized activity" object shape.
 * No splits and no split-summaries.
 */
export type SummarizedActivity = {
    activityId:                      number /* int */;
    name:                            string;
    description?:                    string;
    activityType:                    string;
    userProfileId:                   number /* int */;
    timeZoneId:                      number /* int */;
    beginTimestamp?:                 number /* int */;
    eventTypeId:                     number /* int */;
    rule?:                           string;
    sportType?:                      string;
    startTimeGmt:                    number /* int */;
    startTimeLocal:                  number /* int */;
    duration:                        number /* real */;
    distance?:                       number /* real */;
    elevationGain?:                  number /* real */;
    elevationLoss?:                  number /* real */;
    avgSpeed?:                       number /* real */;
    maxSpeed?:                       number /* real */;
    avgHr?:                          number /* int */;
    maxHr?:                          number /* int */;
    avgPower?:                       number /* int */;
    maxPower?:                       number /* int */;
    avgRunCadence?:                  number /* int */;
    maxRunCadence?:                  number /* int */;
    steps?:                          number /* int */;
    calories?:                       number /* real */;
    bmrCalories?:                    number /* real */;
    startLongitude?:                 number /* real */;
    startLatitude?:                  number /* real */;
    aerobicTrainingEffect?:          number /* real */;
    normPower?:                      number /* int */;
    avgVerticalOscillation?:         number /* real */;
    avgGroundContactTime?:           number /* real */;
    avgStrideLength?:                number /* real */;
    strokes?:                        number /* int */;
    avgStrokes?:                     number /* real */;
    activeLengths?:                  number /* int */;
    avgSwolf?:                       number /* int */;
    avgFractionalCadence?:           number /* real */;
    maxFractionalCadence?:           number /* real */;
    poolLength?:                     number /* int */;
    avgStrokeDistance?:              number /* real */;
    avgSwimCadence?:                 number /* real */;
    vO2MaxValue?:                    number /* int */;
    avgVerticalRatio?:               number /* real */;
    avgGroundContactBalance?:        number /* real */;
    lactateThresholdBpm?:            number /* int */;
    elapsedDuration:                 number /* real */;
    movingDuration?:                 number /* real */;
    anaerobicTrainingEffect?:        number /* real */;
    deviceId?:                       number /* int */;
    parentId?:                       number /* int */;
    minTemperature?:                 number /* int */;
    maxTemperature?:                 number /* int */;
    minElevation?:                   number /* int */;
    maxElevation?:                   number /* int */;
    avgDoubleCadence?:               number /* real */;
    maxDoubleCadence?:               number /* real */;
    locationName?:                   string;
    maxVerticalSpeed?:               number /* real */;
    manufacturer?:                   string;
    lapCount?:                       number /* int */;
    endLongitude?:                   number /* real */;
    endLatitude?:                    number /* real */;
    waterEstimated?:                 number /* int */;
    minRespirationRate?:             number /* real */;
    maxRespirationRate?:             number /* real */;
    avgRespirationRate?:             number /* real */;
    trainingEffectLabel?:            string;
    activityTrainingLoad?:           number /* real */;
    aerobicTrainingEffectMessage?:   string;
    anaerobicTrainingEffectMessage?: string;
    moderateIntensityMinutes?:       number /* int */;
    vigorousIntensityMinutes?:       number /* int */;
    avgGradeAdjustedSpeed?:          number /* real */;
    isRunPowerWindDataEnabled?:      boolean;
    differenceBodyBattery?:          number /* int */;
    workoutFeel?:                    number /* int */;
    workoutRpe?:                     number /* int */;
    runPowerWindDataEnabled?:        boolean;
    purposeful?:                     boolean;
    autoCalcCalories?:               boolean;
    favorite?:                       boolean;
    pr?:                             boolean;
    elevationCorrected?:             boolean;
    atpActivity?:                    boolean;
    parent?:                         boolean;
};




/**
 * SummarizedActivity type predicate.
 */
export const isSummarizedActivity = (c: unknown): c is SummarizedActivity =>
    isComplexRecord(c) &&
    isNumber(c.activityId) &&
    isString(c.name) &&
    orUndefined(isString) (c.description) &&
    isString(c.activityType) &&
    isNumber(c.userProfileId) &&
    isNumber(c.timeZoneId) &&
    orUndefined(isNumber) (c.beginTimestamp) &&
    isNumber(c.eventTypeId) &&
    orUndefined(isString) (c.rule) &&
    orUndefined(isString) (c.sportType) &&
    isNumber(c.startTimeGmt) &&
    isNumber(c.startTimeLocal) &&
    isNumber(c.duration) &&
    orUndefined(isNumber) (c.distance) &&
    orUndefined(isNumber) (c.elevationGain) &&
    orUndefined(isNumber) (c.elevationLoss) &&
    orUndefined(isNumber) (c.avgSpeed) &&
    orUndefined(isNumber) (c.maxSpeed) &&
    orUndefined(isNumber) (c.avgHr) &&
    orUndefined(isNumber) (c.maxHr) &&
    orUndefined(isNumber) (c.avgPower) &&
    orUndefined(isNumber) (c.maxPower) &&
    orUndefined(isNumber) (c.avgRunCadence) &&
    orUndefined(isNumber) (c.maxRunCadence) &&
    orUndefined(isNumber) (c.steps) &&
    orUndefined(isNumber) (c.calories) &&
    orUndefined(isNumber) (c.bmrCalories) &&
    orUndefined(isNumber) (c.startLongitude) &&
    orUndefined(isNumber) (c.startLatitude) &&
    orUndefined(isNumber) (c.aerobicTrainingEffect) &&
    orUndefined(isNumber) (c.normPower) &&
    orUndefined(isNumber) (c.avgVerticalOscillation) &&
    orUndefined(isNumber) (c.avgGroundContactTime) &&
    orUndefined(isNumber) (c.avgStrideLength) &&
    orUndefined(isNumber) (c.strokes) &&
    orUndefined(isNumber) (c.avgStrokes) &&
    orUndefined(isNumber) (c.activeLengths) &&
    orUndefined(isNumber) (c.avgSwolf) &&
    orUndefined(isNumber) (c.avgFractionalCadence) &&
    orUndefined(isNumber) (c.maxFractionalCadence) &&
    orUndefined(isNumber) (c.poolLength) &&
    orUndefined(isNumber) (c.avgStrokeDistance) &&
    orUndefined(isNumber) (c.avgSwimCadence) &&
    orUndefined(isNumber) (c.vO2MaxValue) &&
    orUndefined(isNumber) (c.avgVerticalRatio) &&
    orUndefined(isNumber) (c.avgGroundContactBalance) &&
    orUndefined(isNumber) (c.lactateThresholdBpm) &&
    isNumber(c.elapsedDuration) &&
    orUndefined(isNumber) (c.movingDuration) &&
    orUndefined(isNumber) (c.anaerobicTrainingEffect) &&
    orUndefined(isNumber) (c.deviceId) &&
    orUndefined(isNumber) (c.parentId) &&
    orUndefined(isNumber) (c.minTemperature) &&
    orUndefined(isNumber) (c.maxTemperature) &&
    orUndefined(isNumber) (c.minElevation) &&
    orUndefined(isNumber) (c.maxElevation) &&
    orUndefined(isNumber) (c.avgDoubleCadence) &&
    orUndefined(isNumber) (c.maxDoubleCadence) &&
    orUndefined(isString) (c.locationName) &&
    orUndefined(isNumber) (c.maxVerticalSpeed) &&
    orUndefined(isString) (c.manufacturer) &&
    orUndefined(isNumber) (c.lapCount) &&
    orUndefined(isNumber) (c.endLongitude) &&
    orUndefined(isNumber) (c.endLatitude) &&
    orUndefined(isNumber) (c.waterEstimated) &&
    orUndefined(isNumber) (c.minRespirationRate) &&
    orUndefined(isNumber) (c.maxRespirationRate) &&
    orUndefined(isNumber) (c.avgRespirationRate) &&
    orUndefined(isString) (c.trainingEffectLabel) &&
    orUndefined(isNumber) (c.activityTrainingLoad) &&
    orUndefined(isString) (c.aerobicTrainingEffectMessage) &&
    orUndefined(isString) (c.anaerobicTrainingEffectMessage) &&
    orUndefined(isNumber) (c.moderateIntensityMinutes) &&
    orUndefined(isNumber) (c.vigorousIntensityMinutes) &&
    orUndefined(isNumber) (c.avgGradeAdjustedSpeed) &&
    orUndefined(isBoolean) (c.isRunPowerWindDataEnabled) &&
    orUndefined(isNumber) (c.differenceBodyBattery) &&
    orUndefined(isNumber) (c.workoutFeel) &&
    orUndefined(isNumber) (c.workoutRpe) &&
    orUndefined(isBoolean) (c.runPowerWindDataEnabled) &&
    orUndefined(isBoolean) (c.purposeful) &&
    orUndefined(isBoolean) (c.autoCalcCalories) &&
    orUndefined(isBoolean) (c.favorite) &&
    orUndefined(isBoolean) (c.pr) &&
    orUndefined(isBoolean) (c.elevationCorrected) &&
    orUndefined(isBoolean) (c.atpActivity) &&
    orUndefined(isBoolean) (c.parent);




/**
 * Typescript object to sql params conversion.
 */
export const summarizedActivityToSqlParams = (
    userShortId: string,
    sa: SummarizedActivity,
): FreeFormRecord<PlainValue | Date | null> => ({
    user_short_id: userShortId,
    activity_id: sa.activityId,
    name: sa.name,
    description: undefinedToNull(sa.description),
    activity_type: sa.activityType,
    user_profile_id: sa.userProfileId,
    time_zone_id: sa.timeZoneId,
    begin_timestamp: sa.beginTimestamp ? new Date(sa.beginTimestamp) : null,
    event_type_id: sa.eventTypeId,
    rule: undefinedToNull(sa.rule),
    sport_type: undefinedToNull(sa.sportType),
    start_time_gmt: new Date(sa.startTimeGmt),
    start_time_local: new Date(sa.startTimeLocal),
    duration: sa.duration,
    distance: undefinedToNull(sa.distance),
    elevation_gain: undefinedToNull(sa.elevationGain),
    elevation_loss: undefinedToNull(sa.elevationLoss),
    avg_speed: undefinedToNull(sa.avgSpeed),
    max_speed: undefinedToNull(sa.maxSpeed),
    avg_hr: undefinedToNull(sa.avgHr),
    max_hr: undefinedToNull(sa.maxHr),
    avg_power: undefinedToNull(sa.avgPower),
    max_power: undefinedToNull(sa.maxPower),
    avg_run_cadence: undefinedToNull(sa.avgRunCadence),
    max_run_cadence: undefinedToNull(sa.maxRunCadence),
    steps: undefinedToNull(sa.steps),
    calories: undefinedToNull(sa.calories),
    bmr_calories: undefinedToNull(sa.bmrCalories),
    start_position:
        isNumber(sa.startLongitude) && isNumber(sa.startLatitude)
            ? `POINT(${sa.startLongitude} ${sa.startLatitude})`
            : null,
    aerobic_training_effect: undefinedToNull(sa.aerobicTrainingEffect),
    norm_power: undefinedToNull(sa.normPower),
    avg_vertical_oscillation: undefinedToNull(sa.avgVerticalOscillation),
    avg_ground_contact_time: undefinedToNull(sa.avgGroundContactTime),
    avg_stride_length: undefinedToNull(sa.avgStrideLength),
    strokes: undefinedToNull(sa.strokes),
    avg_strokes: undefinedToNull(sa.avgStrokes),
    active_lengths: undefinedToNull(sa.activeLengths),
    avg_swolf: undefinedToNull(sa.avgSwolf),
    avg_fractional_cadence: undefinedToNull(sa.avgFractionalCadence),
    max_fractional_cadence: undefinedToNull(sa.maxFractionalCadence),
    pool_length: undefinedToNull(sa.poolLength),
    avg_stroke_distance: undefinedToNull(sa.avgStrokeDistance),
    avg_swim_cadence: undefinedToNull(sa.avgSwimCadence),
    v_o2_max_value: undefinedToNull(sa.vO2MaxValue),
    avg_vertical_ratio: undefinedToNull(sa.avgVerticalRatio),
    avg_ground_contact_balance: undefinedToNull(sa.avgGroundContactBalance),
    lactate_threshold_bpm: undefinedToNull(sa.lactateThresholdBpm),
    elapsed_duration: undefinedToNull(sa.elapsedDuration),
    moving_duration: undefinedToNull(sa.movingDuration),
    anaerobic_training_effect: undefinedToNull(sa.anaerobicTrainingEffect),
    device_id: undefinedToNull(sa.deviceId),
    parent_id: undefinedToNull(sa.parentId),
    min_temperature: undefinedToNull(sa.minTemperature),
    max_temperature: undefinedToNull(sa.maxTemperature),
    min_elevation: undefinedToNull(sa.minElevation),
    max_elevation: undefinedToNull(sa.maxElevation),
    avg_double_cadence: undefinedToNull(sa.avgDoubleCadence),
    max_double_cadence: undefinedToNull(sa.maxDoubleCadence),
    location_name: undefinedToNull(sa.locationName),
    max_vertical_speed: undefinedToNull(sa.maxVerticalSpeed),
    manufacturer: undefinedToNull(sa.manufacturer),
    lap_count: undefinedToNull(sa.lapCount),
    end_position:
        isNumber(sa.endLongitude) && isNumber(sa.endLatitude)
            ? `POINT(${sa.endLongitude} ${sa.endLatitude})`
            : null,
    water_estimated: undefinedToNull(sa.waterEstimated),
    min_respiration_rate: undefinedToNull(sa.minRespirationRate),
    max_respiration_rate: undefinedToNull(sa.maxRespirationRate),
    avg_respiration_rate: undefinedToNull(sa.avgRespirationRate),
    training_effect_label: undefinedToNull(sa.trainingEffectLabel),
    activity_training_load: undefinedToNull(sa.activityTrainingLoad),
    aerobic_training_effect_message: undefinedToNull(sa.aerobicTrainingEffectMessage),
    anaerobic_training_effect_message: undefinedToNull(sa.anaerobicTrainingEffectMessage),
    moderate_intensity_minutes: undefinedToNull(sa.moderateIntensityMinutes),
    vigorous_intensity_minutes: undefinedToNull(sa.vigorousIntensityMinutes),
    avg_grade_adjusted_speed: undefinedToNull(sa.avgGradeAdjustedSpeed),
    is_run_power_wind_data_enabled: undefinedToNull(sa.isRunPowerWindDataEnabled),
    difference_body_battery: undefinedToNull(sa.differenceBodyBattery),
    workout_feel: undefinedToNull(sa.workoutFeel),
    workout_rpe: undefinedToNull(sa.workoutRpe),
    run_power_wind_data_enabled: undefinedToNull(sa.runPowerWindDataEnabled),
    purposeful: undefinedToNull(sa.purposeful),
    auto_calc_calories: undefinedToNull(sa.autoCalcCalories),
    favorite: undefinedToNull(sa.favorite),
    pr: undefinedToNull(sa.pr),
    elevation_corrected: undefinedToNull(sa.elevationCorrected),
    atp_activity: undefinedToNull(sa.atpActivity),
    parent: undefinedToNull(sa.parent),
});
