--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- simplified geometry for all hikes and walks no shorter than 3km
WITH hikes_and_walks AS (
    SELECT
        garmin.summarized_activity.name AS name,
        garmin.summarized_activity.description AS description,
        garmin.summarized_activity.begin_timestamp AS start_timestamp,
        garmin.summarized_activity.distance / 100000 AS distance,
        garmin.summarized_activity.start_position AS start_position,
        ST_Simplify(garmin.fit_track.track::geometry, 0.0001)::geography AS track,
        garmin.summarized_activity.activity_type AS activity_type,
        garmin.summarized_activity.sport_type AS sport_type
    FROM garmin.summarized_activity
        INNER JOIN garmin.fit_track
            ON garmin.summarized_activity.begin_timestamp =
                garmin.fit_track.begin_timestamp
    WHERE
        start_position IS NOT NULL AND
        (activity_type = 'hiking' OR activity_type = 'walking') AND
        distance / 100000 >= 3
    ORDER BY distance DESC
)
SELECT start_position AS geom
FROM hikes_and_walks
UNION ALL
SELECT track AS geom
FROM hikes_and_walks;
