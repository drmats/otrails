/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/**
 * Type definitions for fit-file-parser.
 */
declare module "fit-file-parser" {

    /**
     * ...
     */
    export type FitDeviceSettings = {
        utc_offset: number;
        time_offset: number;
        active_time_zone: number;
        time_zone_offset: number;
        display_orientation?:
            | "auto"
            | "portrait"
            | "landscape"
            | "portrait_flipped"
            | "landscape_flipped";
        mounting_side?: string;
        number_of_screens?: string;
    };


    /**
     * ...
     */
    export type FitUserProfile = {
        weight?: number;
        gender?: "male" | "female";
        height?: number;
        language?: string;
        elev_setting?: string;
        weight_setting?: string;
        resting_heart_rate?: number;
        hr_setting?: string;
        speed_setting?: string;
        dist_setting?: string;
        activity_class: undefined;
        position_setting?: string;
        temperature_setting?: string;
        height_setting?: string;
    };


    /**
     * ...
     */
    export type FitZonesTarget = {
        functional_threshold_power?: number;
        threshold_heart_rate?: number;
        hr_calc_type?: string;
        pwr_calc_type?: string;
    };


    /**
     * ...
     */
    export type FitLeftRightBalance = unknown;


    /**
     * ...
     */
    export type FitMessageIndex = unknown;


    /**
     * ...
     */
    export type FitWktStepIndex = unknown;


    /**
     * ...
     */
    export type FitLapRecord = {
        timestamp: Date;
        elapsed_time: number;
        timer_time: number;
        position_lat: number;
        position_long: number;
        distance: number;
        enhanced_speed: number;
        enhanced_altitude: number;
        heart_rate: number;
        temperature: number;
    };


    /**
     * ...
     */
    export type FitLap = {
        timestamp: Date;
        start_time: Date;
        start_position_lat: number;
        start_position_long: number;
        end_position_lat: number;
        end_position_long: number;
        total_elapsed_time: number;
        total_timer_time: number;
        total_distance: number;
        enhanced_avg_speed: number;
        enhanced_max_speed: number;
        message_index?: FitMessageIndex;
        total_calories: number;
        total_ascent: number;
        total_descent: number;
        left_right_balance?: FitLeftRightBalance;
        wkt_step_index?: FitWktStepIndex;
        event: string;
        event_type: string;
        avg_heart_rate: number;
        max_heart_rate: number;
        intensity: string;
        lap_trigger: string;
        sport: string;
        swim_stroke?: string;
        sub_sport: string;
        avg_temperature: number;
        max_temperature: number;
        records?: FitLapRecord[];
    };


    /**
     * ...
     */
    export type FitSession = {
        timestamp: Date;
        start_time: Date;
        start_position_lat: number;
        start_position_long: number;
        total_elapsed_time: number;
        total_timer_time: number;
        total_distance: number;
        nec_lat: number;
        nec_long: number;
        swc_lat: number;
        swc_long: number;
        enhanced_avg_speed: number;
        enhanced_max_speed: number;
        message_index?: FitMessageIndex;
        total_calories: number;
        total_ascent: number;
        total_descent: number;
        first_lap_index: number;
        num_laps: number;
        left_right_balance?: FitLeftRightBalance;
        event: string;
        event_type: string;
        sport: string;
        sub_sport: string;
        avg_heart_rate: number;
        max_heart_rate: number;
        total_training_effect: number;
        trigger: string;
        swim_stroke?: string;
        pool_length_unit?: string;
        avg_temperature: number;
        max_temperature: number;
        total_anaerobic_effect: number;
        laps?: FitLap[];
    };


    /**
     * ...
     */
    export type FitEvent = {
        timestamp: Date;
        data: number;
        event: string;
        event_type: string;
        event_group: number;
    };


    /**
     * ...
     */
    export type FitDeviceInfo = {
        timestamp: Date;
        serial_number: number;
        manufacturer: string;
        product: number;
        software_version: number;
        device_index: number;
        device_type?: string;
        battery_status?: string;
        sensor_position?: string;
        ant_network?: string;
        source_type: string;
    };


    /**
     * ...
     */
    export type FitSport = {
        name: string;
        sport: string;
        sub_sport: string;
    };


    /**
     * ...
     */
    export type FitActivity = {
        timestamp?: Date;
        total_timer_time?: number;
        local_timestamp?: Date;
        num_sessions?: number;
        type?: string;
        event?: string;
        event_type?: string;
        sessions: FitSession[];
        events: FitEvent[];
        hrv: unknown[];
        device_infos: FitDeviceInfo[];
        developer_data_ids: unknown[];
        field_descriptions: unknown[];
        sports: FitSport[];
    };


    /**
     * Parsed fit-file shape.
     */
    export type FitObject = {
        protocolVersion: number;
        profileVersion: number;
        file_creator: { software_version: number };
        device_settings?: FitDeviceSettings;
        user_profile?: FitUserProfile;
        zones_target?: FitZonesTarget;
        activity?: FitActivity;
    };


    /**
     * Default fit-file parsing class.
     */
    export default class FitParser {

        constructor (options?: {
            force?: boolean;
            speedUnit?: "m/s" | "mph" | "km/h";
            lengthUnit?: "m" | "mi" | "km";
            temperatureUnit?: "celsius" | "kelvin" | "fahrenheit";
            elapsedRecordField?: boolean;
            mode: "list" | "cascade" | "both";
        });

        parse (
            content: Buffer,
            callback: (err: string | null, data: FitObject) => void,
        ): void;

    }

}
