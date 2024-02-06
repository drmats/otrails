--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS tiles;




-- "on foot" activities coverage (envelopes)
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_bounds CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_bounds AS (
    SELECT ST_Union(ST_Envelope(track)) AS boundary
    FROM garmin.on_foot
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tiles.on_foot_bounds;




-- "on foot" activities detailed coverage (convex hulls)
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_hulls CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_hulls AS (
    SELECT ST_Union(ST_ConvexHull(track)) AS hull
    FROM garmin.on_foot
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tiles.on_foot_hulls;




-- "on foot" activities mvt tiles coverage (max zoom 16)
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_mvt_coords CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_mvt_coords AS (
    WITH RECURSIVE

    -- boundary coordinate system
    -- transformed from WGS84 to Spherical Mercator (web)
    bounds (boundary) AS (
        SELECT ST_Transform(hull, 3857) AS boundary
        FROM tiles.on_foot_hulls
    ),

    -- coordinates of direct subtiles (one-zoom-level higher)
    delta (x, y) AS (
        VALUES
            (0, 0),
            (0, 1),
            (1, 0),
            (1, 1)
    ),

    -- all coordinates of mvt tiles intersecting with boundary geometry
    tile_coords (z, x, y) AS (
        SELECT 0, 0, 0
        UNION ALL
        SELECT
            z + 1,
            2 * tile_coords.x + delta.x,
            2 * tile_coords.y + delta.y
        FROM tile_coords CROSS JOIN delta
        WHERE
            z < 16 AND
            ST_Intersects(
                ST_TileEnvelope(
                    z + 1,
                    2 * tile_coords.x + delta.x,
                    2 * tile_coords.y + delta.y
                ),
                (SELECT boundary FROM bounds)
            )
    )

    -- fetch mvt coords (zxy) and tile envelopes (WGS84)
    SELECT
        z, x, y,
        ST_Transform(ST_TileEnvelope(z, x, y), 4326) AS envelope
    FROM tile_coords
)
WITH NO DATA;
CREATE INDEX IF NOT EXISTS on_foot_mvt_coords_envelope_gix
    ON tiles.on_foot_mvt_coords USING gist (envelope);
REFRESH MATERIALIZED VIEW tiles.on_foot_mvt_coords;




-- "on foot" track minimum bounding circles
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_circle CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_circle AS (
    WITH
    mercator_track AS (
        SELECT
            track_id,
            user_short_id,
            ST_Transform(track, 3857) AS track
        FROM garmin.on_foot
    ),
    bounding_radius AS (
        SELECT
            track_id,
            user_short_id,
            track,
            (ST_MinimumBoundingRadius(track)).*
        FROM mercator_track
    )
    SELECT
        track_id,
        user_short_id,
        ST_Transform(center, 4326) AS center,
        ST_Transform(ST_MinimumBoundingCircle(track), 4326) AS bounding,
        radius
    FROM bounding_radius
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tiles.on_foot_circle;
