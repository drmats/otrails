--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- simplified geometry for all hikes and walks no shorter than 100 m
WITH
tracked_activities AS (
    SELECT
        garmin.summarized_activity.name AS name,
        garmin.summarized_activity.description AS description,
        garmin.summarized_activity.distance / 100000 AS distance,
        garmin.summarized_activity.begin_timestamp AS start_timestamp,
        garmin.summarized_activity.activity_type AS activity_type,
        garmin.summarized_activity.sport_type AS sport_type,
        garmin.simple_track.sport AS track_sport,
        garmin.simple_track.id AS track_id,
        garmin.simple_track.source_type AS track_source_type,
        garmin.summarized_activity.user_short_id AS user_short_id,
        garmin.summarized_activity.start_position AS start_position,
        ST_Simplify(garmin.simple_track.track::geometry, 0.0001)::geography AS track
    FROM garmin.summarized_activity
        INNER JOIN garmin.simple_track
            ON garmin.summarized_activity.begin_timestamp =
                garmin.simple_track.begin_timestamp
    ORDER BY garmin.summarized_activity.begin_timestamp
),
hikes_and_walks AS (
    SELECT *
    FROM tracked_activities
    WHERE
        (activity_type = 'hiking' OR activity_type = 'walking') AND
        distance >= 0.1
)
SELECT start_position AS geom
FROM hikes_and_walks
UNION ALL
SELECT track AS geom
FROM hikes_and_walks;
