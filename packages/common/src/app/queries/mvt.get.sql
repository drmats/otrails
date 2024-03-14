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
intersecting_track AS (
    SELECT track.simple.*
    FROM track.simple
        INNER JOIN tile.track_mvt_intersection
            ON track.simple.id = tile.track_mvt_intersection.track_id
    WHERE
        tile.track_mvt_intersection.z = (SELECT v FROM z) AND
        tile.track_mvt_intersection.x = (SELECT v FROM x) AND
        tile.track_mvt_intersection.y = (SELECT v FROM y)
),

-- transformed and clipped track geometries with attributes
track_geometry AS (
    SELECT
        ST_SimplifyPreserveTopology (
            ST_AsMVTGeom(
                ST_Transform(intersecting_track.line, 3857),
                ST_TileEnvelope(
                    (SELECT v FROM z),
                    (SELECT v FROM x),
                    (SELECT v FROM y)
                ),
                extent => 4096, buffer => 128, clip_geom => true
            ),
            10
        ) AS mvt_track_geom,
        track.properties.track_id AS track_id,
        track.properties.activity_type AS activity_type,
        track.properties.user_short_id AS user_short_id,
        track.properties.begin_timestamp AS begin_timestamp,
        track.properties.track_name AS track_name
    FROM intersecting_track
        INNER JOIN track.properties
            ON intersecting_track.id = track.properties.track_id
),

-- transformed and clipped point geometries
point_geometry AS (
    SELECT
        ST_AsMVTGeom(
            ST_Transform(ST_StartPoint(intersecting_track.line), 3857),
            ST_TileEnvelope(
                (SELECT v FROM z),
                (SELECT v FROM x),
                (SELECT v FROM y)
            ),
            extent => 4096, buffer => 128, clip_geom => true
        ) AS mvt_point_geom,
        track.properties.track_id AS track_id
    FROM intersecting_track
        INNER JOIN track.properties
            ON intersecting_track.id = track.properties.track_id
)

-- binary tile
SELECT
    1 AS layer_ordering,
    COALESCE(
        ST_AsMVT(track_geometry.*, 'track', 4096, 'mvt_track_geom', 'track_id'),
        ''
    ) AS layer
FROM track_geometry

UNION ALL

SELECT
    2 AS layer_ordering,
    COALESCE(
        ST_AsMVT(point_geometry.*, 'start', 4096, 'mvt_point_geom', 'track_id'),
        ''
    ) AS layer
FROM point_geometry

ORDER BY layer_ordering ASC;
