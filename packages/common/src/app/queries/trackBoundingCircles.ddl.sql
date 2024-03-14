--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS tile;




-- track minimum bounding circles:
-- circle centers intended to be used as track marks for low zoom levels
DROP MATERIALIZED VIEW IF EXISTS tile.track_circle CASCADE;
CREATE MATERIALIZED VIEW tile.track_circle AS (
    WITH
    mercator_track AS (
        SELECT
            track.properties.track_id AS track_id,
            ST_Transform(track.properties.track, 3857) AS track
        FROM track.properties
    ),
    bounding_radius AS (
        SELECT
            track_id,
            track,
            (ST_MinimumBoundingRadius(track)).*
        FROM mercator_track
    )
    SELECT
        track_id,
        ST_Transform(center, 4326) AS center,
        ST_Transform(ST_MinimumBoundingCircle(track), 4326) AS bounding,
        radius
    FROM bounding_radius
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tile.track_circle;
