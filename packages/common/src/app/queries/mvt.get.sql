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
track_intersections AS (
    SELECT track_id
    FROM tile.track_mvt_intersection
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
                ST_Transform(track.simple.line, 3857),
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
        track.simple.id AS track_id,
        track.properties.activity_type AS activity_type,
        track.properties.user_short_id AS user_short_id,
        track.properties.begin_timestamp::text AS begin_timestamp,
        track.properties.track_name AS track_name
    FROM track.simple
        INNER JOIN track_intersections
            ON track.simple.id = track_intersections.track_id
        INNER JOIN track.properties
            ON track.simple.id = track.properties.track_id
)

-- binary tile
SELECT
    COALESCE(
        ST_AsMVT(track_geometries.*, 'track', 4096, 'mvtgeom', 'track_id'),
        ''
    ) AS layer
FROM track_geometries;
