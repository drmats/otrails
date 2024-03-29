--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS garmin;




-- all activities with associated tracks and simplified geometry
DROP VIEW IF EXISTS garmin.tracked_activity CASCADE;
CREATE VIEW garmin.tracked_activity AS (
    SELECT
        track.simple.id AS track_id,
        garmin.summarized_activity.id AS summarized_activity_id,
        garmin.summarized_activity.begin_timestamp AS begin_timestamp,
        garmin.summarized_activity.name AS name,
        garmin.summarized_activity.description AS description,
        garmin.summarized_activity.distance / 100 AS distance,
        garmin.summarized_activity.steps AS steps,
        ((garmin.summarized_activity.duration / 1000) || ' second')::interval AS duration,
        ((garmin.summarized_activity.elapsed_duration / 1000) || ' second')::interval AS elapsed_duration,
        ((garmin.summarized_activity.moving_duration / 1000) || ' second')::interval AS moving_duration,
        garmin.summarized_activity.elevation_gain / 100 AS elevation_gain,
        garmin.summarized_activity.elevation_loss / 100 AS elevation_loss,
        garmin.summarized_activity.activity_type AS activity_type,
        garmin.summarized_activity.sport_type AS sport_type,
        track.simple.sport AS track_sport,
        track.simple.source_type AS track_source_type,
        garmin.summarized_activity.user_short_id AS user_short_id,
        garmin.summarized_activity.user_profile_id AS user_profile_id,
        garmin.summarized_activity.start_position AS start_position,
        garmin.summarized_activity.end_position AS end_position,
        track.simple.source_name AS track_name
    FROM garmin.summarized_activity
        INNER JOIN track.simple ON
            garmin.summarized_activity.begin_timestamp =
                track.simple.begin_timestamp AND
            garmin.summarized_activity.user_short_id =
                track.simple.user_short_id
    ORDER BY garmin.summarized_activity.begin_timestamp
);




-- simplified geometry for all hikes and walks no shorter than 100 m
DROP VIEW IF EXISTS garmin.hike_or_walk CASCADE;
CREATE VIEW garmin.hike_or_walk AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        (
            activity_type = 'hiking' OR
            activity_type = 'rock_climbing' OR
            activity_type = 'walking' OR
            activity_type = 'casual_walking' OR
            activity_type = 'speed_walking'
        ) AND distance >= 100
);




-- simplified geometry for all run activities no shorter than 100 m
DROP VIEW IF EXISTS garmin.run CASCADE;
CREATE VIEW garmin.run AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        (
            activity_type = 'running' OR
            activity_type = 'trail_running'
        ) AND distance >= 100
);




-- simplified geometry for all bike activities no shorter than 100 m
DROP VIEW IF EXISTS garmin.bike CASCADE;
CREATE VIEW garmin.bike AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        (
            activity_type = 'cycling' OR
            activity_type = 'road_biking' OR
            activity_type = 'gravel_cycling' OR
            activity_type = 'mountain_biking'
        ) AND distance >= 100
);




-- simplified geometry for all water activities no shorter than 100 m
DROP VIEW IF EXISTS garmin.water CASCADE;
CREATE VIEW garmin.water AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        (
            activity_type = 'kayaking_v2' OR
            activity_type = 'open_water_swimming' OR
            activity_type = 'rowing_v2' OR
            activity_type = 'sailing_v2' OR
            activity_type = 'whitewater_rafting_kayaking'
        ) AND distance >= 100
);




-- simplified geometry for all "sport" activities
-- (hike, walk, run, bike, water) no shorter than 100 m
DROP VIEW IF EXISTS garmin.sport CASCADE;
CREATE VIEW garmin.sport AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        (
            activity_type = 'hiking' OR
            activity_type = 'rock_climbing' OR
            activity_type = 'walking' OR
            activity_type = 'casual_walking' OR
            activity_type = 'speed_walking' OR
            activity_type = 'running' OR
            activity_type = 'trail_running' OR
            activity_type = 'cycling' OR
            activity_type = 'road_biking' OR
            activity_type = 'gravel_cycling' OR
            activity_type = 'mountain_biking' OR
            activity_type = 'kayaking_v2' OR
            activity_type = 'open_water_swimming' OR
            activity_type = 'rowing_v2' OR
            activity_type = 'sailing_v2' OR
            activity_type = 'whitewater_rafting_kayaking'
        ) AND distance >= 100
);




-- simplified geometry for all other activities no shorter than 100 m
DROP VIEW IF EXISTS garmin.other;
CREATE VIEW garmin.other AS (
    SELECT *
    FROM garmin.tracked_activity
    WHERE
        activity_type != 'hiking' AND
        activity_type != 'rock_climbing' AND
        activity_type != 'walking' AND
        activity_type != 'casual_walking' AND
        activity_type != 'speed_walking' AND
        activity_type != 'running' AND
        activity_type != 'trail_running' AND
        activity_type != 'cycling' AND
        activity_type != 'road_biking' AND
        activity_type != 'gravel_cycling' AND
        activity_type != 'mountain_biking' AND
        activity_type != 'kayaking_v2' AND
        activity_type != 'open_water_swimming' AND
        activity_type != 'rowing_v2' AND
        activity_type != 'sailing_v2' AND
        activity_type != 'whitewater_rafting_kayaking' AND
        distance >= 100
);
