--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS garmin;




-- ...
CREATE TABLE IF NOT EXISTS garmin.summarized_activity (
    id                                   SERIAL           PRIMARY KEY NOT NULL,
    user_short_id                        TEXT             NOT NULL,
    activity_id                          BIGINT           NOT NULL,
    name                                 TEXT             NOT NULL,
    description                          TEXT,
    activity_type                        TEXT             NOT NULL,
    user_profile_id                      BIGINT           NOT NULL,
    time_zone_id                         SMALLINT         NOT NULL,
    begin_timestamp                      TIMESTAMPTZ,
    event_type_id                        SMALLINT         NOT NULL,
    rule                                 TEXT,
    sport_type                           TEXT,
    start_time_gmt                       TIMESTAMPTZ      NOT NULL,
    start_time_local                     TIMESTAMPTZ      NOT NULL,
    duration                             REAL             NOT NULL,
    distance                             REAL,
    elevation_gain                       REAL,
    elevation_loss                       REAL,
    avg_speed                            REAL,
    max_speed                            REAL,
    avg_hr                               SMALLINT,
    max_hr                               SMALLINT,
    avg_power                            SMALLINT,
    max_power                            SMALLINT,
    avg_run_cadence                      SMALLINT,
    max_run_cadence                      SMALLINT,
    steps                                INT,
    calories                             REAL,
    bmr_calories                         REAL,
    start_position                       GEOGRAPHY(Point),
    aerobic_training_effect              REAL,
    norm_power                           SMALLINT,
    avg_vertical_oscillation             REAL,
    avg_ground_contact_time              REAL,
    avg_stride_length                    REAL,
    strokes                              INT,
    avg_strokes                          REAL,
    active_lengths                       SMALLINT,
    avg_swolf                            SMALLINT,
    avg_fractional_cadence               REAL,
    max_fractional_cadence               REAL,
    pool_length                          SMALLINT,
    avg_stroke_distance                  REAL,
    avg_swim_cadence                     REAL,
    v_o2_max_value                       SMALLINT,
    avg_vertical_ratio                   REAL,
    avg_ground_contact_balance           REAL,
    lactate_threshold_bpm                SMALLINT,
    elapsed_duration                     REAL             NOT NULL,
    moving_duration                      REAL,
    anaerobic_training_effect            REAL,
    device_id                            BIGINT,
    parent_id                            BIGINT,
    min_temperature                      SMALLINT,
    max_temperature                      SMALLINT,
    min_elevation                        INT,
    max_elevation                        INT,
    avg_double_cadence                   REAL,
    max_double_cadence                   REAL,
    location_name                        TEXT,
    max_vertical_speed                   REAL,
    manufacturer                         TEXT,
    lap_count                            SMALLINT,
    end_position                         GEOGRAPHY(Point),
    water_estimated                      SMALLINT,
    min_respiration_rate                 REAL,
    max_respiration_rate                 REAL,
    avg_respiration_rate                 REAL,
    training_effect_label                TEXT,
    activity_training_load               REAL,
    aerobic_training_effect_message      TEXT,
    anaerobic_training_effect_message    TEXT,
    moderate_intensity_minutes           SMALLINT,
    vigorous_intensity_minutes           SMALLINT,
    avg_grade_adjusted_speed             REAL,
    is_run_power_wind_data_enabled       BOOLEAN ,
    difference_body_battery              SMALLINT,
    workout_feel                         SMALLINT,
    workout_rpe                          SMALLINT,
    run_power_wind_data_enabled          BOOLEAN,
    purposeful                           BOOLEAN,
    auto_calc_calories                   BOOLEAN,
    favorite                             BOOLEAN,
    pr                                   BOOLEAN,
    elevation_corrected                  BOOLEAN,
    atp_activity                         BOOLEAN,
    parent                               BOOLEAN
);

CREATE INDEX IF NOT EXISTS summarized_activity_user_short_id_idx
    ON garmin.summarized_activity USING btree (user_short_id);

CREATE UNIQUE INDEX IF NOT EXISTS summarized_activity_activity_id_idx
    ON garmin.summarized_activity USING btree (activity_id);

CREATE INDEX IF NOT EXISTS summarized_activity_name_idx
    ON garmin.summarized_activity USING btree (name);

CREATE INDEX IF NOT EXISTS summarized_activity_activity_type_idx
    ON garmin.summarized_activity USING btree (activity_type);

CREATE INDEX IF NOT EXISTS summarized_activity_begin_timestamp_idx
    ON garmin.summarized_activity USING brin (begin_timestamp);

CREATE INDEX IF NOT EXISTS summarized_activity_duration_idx
    ON garmin.summarized_activity USING btree (duration);

CREATE INDEX IF NOT EXISTS summarized_activity_distance_idx
    ON garmin.summarized_activity USING btree (distance);

CREATE INDEX IF NOT EXISTS summarized_activity_start_position_gix
    ON garmin.summarized_activity USING gist (start_position);

CREATE INDEX IF NOT EXISTS summarized_activity_end_position_gix
    ON garmin.summarized_activity USING gist (end_position);
