--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- tile rendering
WITH

-- requested zoom
z (v) AS (VALUES ($<z>)),

-- requested coordinate x
x (v) AS (VALUES ($<x>)),

-- requested coordinate y
y (v) AS (VALUES ($<y>)),

-- tracks intersecting requested coordinate (precomputed)
intersections AS (
    SELECT track_id
    FROM tile.sport_mvt_intersection
    WHERE
        z = (SELECT v FROM z) AND
        x = (SELECT v FROM x) AND
        y = (SELECT v FROM y)
),

-- transformed and clipped track geometries with attributes
track_geometries AS (
    SELECT
        ST_SimplifyPreserveTopology (
            ST_AsMVTGeom(
                ST_Transform(garmin.simple_track.line, 3857),
                ST_TileEnvelope(
                    (SELECT v FROM z),
                    (SELECT v FROM x),
                    (SELECT v FROM y)
                ),
                extent => 4096,
                buffer => 128
            ),
            10
        ) AS mvtgeom,
        garmin.simple_track.id AS track_id,
        garmin.tracked_activity.activity_type AS activity_type,
        garmin.tracked_activity.user_short_id AS user_short_id,
        garmin.tracked_activity.begin_timestamp::text AS begin_timestamp
    FROM garmin.simple_track
        INNER JOIN intersections
            ON garmin.simple_track.id = intersections.track_id
        INNER JOIN garmin.tracked_activity
            ON garmin.simple_track.id = garmin.tracked_activity.track_id
)

-- binary tile
SELECT
    COALESCE(
        ST_AsMVT(track_geometries.*, 'track', 4096, 'mvtgeom', 'track_id'),
        ''
    ) AS layer
FROM track_geometries;
