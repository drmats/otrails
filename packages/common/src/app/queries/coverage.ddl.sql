--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS tiles;




-- "on foot" activities coverage
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_bounds CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_bounds AS (
    SELECT ST_Union(ST_SetSRID(Box2D(track), 4326)) AS boundary
    FROM garmin.on_foot
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tiles.on_foot_bounds;




-- "on foot" activities mvt tiles coverage (max zoom 16)
DROP MATERIALIZED VIEW IF EXISTS tiles.on_foot_mvt_coords CASCADE;
CREATE MATERIALIZED VIEW tiles.on_foot_mvt_coords AS (
    WITH RECURSIVE

    -- boundary coordinate system
    -- transformed from WGS84 to Spherical Mercator (web)
    bounds (boundary) AS (
        SELECT ST_Transform(boundary, 3857) AS boundary
        FROM tiles.on_foot_bounds
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
            z <= 16 AND
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
REFRESH MATERIALIZED VIEW tiles.on_foot_mvt_coords;