--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS track;




-- simplified track geometries
-- (for convex hulls compute, intersections or previews)
-- for all simple tracks
DROP VIEW IF EXISTS track.simplified CASCADE;
CREATE VIEW track.simplified AS (
    SELECT
        track.simple.id AS track_id,
        ST_Simplify(track.simple.line, 0.0001) AS track
    FROM track.simple
);




-- all track properties (to be baked into tiles)
-- for garmin "sport" and igc flight sources
DROP VIEW IF EXISTS track.props_view CASCADE;
CREATE VIEW track.props_view AS (
    SELECT
        garmin.sport.track_id AS track_id,
        garmin.sport.activity_type AS activity_type,
        garmin.sport.user_short_id AS user_short_id,
        garmin.sport.begin_timestamp AS begin_timestamp,
        garmin.sport.track_name AS track_name
    FROM garmin.sport
    UNION ALL
    SELECT
        track.simple.id AS track_id,
        track.simple.sport AS activity_type,
        track.simple.user_short_id AS user_short_id,
        track.simple.begin_timestamp AS begin_timestamp,
        track.simple.source_name AS track_name
    FROM track.simple
    WHERE
        track.simple.sport = 'paragliding' OR
        track.simple.sport = 'tandem_paragliding'
);




-- track properties with simplified geometry
-- for garmin "sport" and igc flight sources
DROP MATERIALIZED VIEW IF EXISTS track.properties CASCADE;
CREATE MATERIALIZED VIEW track.properties AS (
    SELECT
        track.props_view.*,
        track.simplified.track AS track
    FROM track.props_view
        INNER JOIN track.simplified
            ON track.props_view.track_id = track.simplified.track_id
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW track.properties;
