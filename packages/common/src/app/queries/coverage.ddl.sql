--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS tile;




-- "on foot" track minimum bounding circles:
-- circle centers intended to be used as track marks
-- for low zoom levels
DROP MATERIALIZED VIEW IF EXISTS tile.on_foot_circle CASCADE;
CREATE MATERIALIZED VIEW tile.on_foot_circle AS (
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
REFRESH MATERIALIZED VIEW tile.on_foot_circle;




-- "on foot" activities coverage (union of envelopes)
DROP MATERIALIZED VIEW IF EXISTS tile.on_foot_bounds_union CASCADE;
CREATE MATERIALIZED VIEW tile.on_foot_bounds_union AS (
    SELECT ST_Union(ST_Envelope(track)) AS boundary
    FROM garmin.on_foot
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tile.on_foot_bounds_union;




-- "on foot" activities detailed coverage (union of convex hulls)
DROP MATERIALIZED VIEW IF EXISTS tile.on_foot_hulls_union CASCADE;
CREATE MATERIALIZED VIEW tile.on_foot_hulls_union AS (
    SELECT ST_Union(ST_ConvexHull(track)) AS hull
    FROM garmin.on_foot
)
WITH NO DATA;
REFRESH MATERIALIZED VIEW tile.on_foot_hulls_union;




-- "on foot" activities mvt tiles coverage (max zoom 16),
-- first approximation - intersecting with precomputed activity geometries
-- convex hulls (no "holes" inside closed or c-shaped activity track-lines)
DROP MATERIALIZED VIEW IF EXISTS tile.on_foot_approx_mvt_envelope CASCADE;
CREATE MATERIALIZED VIEW tile.on_foot_approx_mvt_envelope AS (
    WITH RECURSIVE

    -- boundary (single row with merged geometry)
    -- coordinate system transformed from WGS84 to Spherical Mercator (web)
    bounds (boundary) AS (
        SELECT ST_Transform(hull, 3857) AS boundary
        FROM tile.on_foot_hulls_union
    ),

    -- coordinates of direct subtiles (one-zoom-level deeper)
    delta (x, y) AS (
        VALUES
            (0, 0),
            (0, 1),
            (1, 0),
            (1, 1)
    ),

    -- all coordinates of mvt tiles intersecting with boundary geometry
    -- top-down recursive CTE (zoom level 0 to zoom level 16)
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

    -- all mvt tile coordinates with WGS84-projected tile envelopes
    -- with spatial index for further querying
    SELECT
        z, x, y,
        ST_Transform(ST_TileEnvelope(z, x, y), 4326) AS envelope
    FROM tile_coords
)
WITH NO DATA;
CREATE INDEX IF NOT EXISTS on_foot_approx_mvt_envelope_envelope_gix
    ON tile.on_foot_approx_mvt_envelope USING gist (envelope);
REFRESH MATERIALIZED VIEW tile.on_foot_approx_mvt_envelope;




-- all mvt tile coordinates to "on foot" track intersection mapping
-- (z, x, y) -> track_id[]
DROP MATERIALIZED VIEW IF EXISTS tile.on_foot_mvt_intersection CASCADE;
CREATE MATERIALIZED VIEW tile.on_foot_mvt_intersection AS (
    WITH RECURSIVE

    -- all finest-zoom-level tile coordinates with corresponding track ids
    z16_tiles (z, x, y, track_id) AS (
        SELECT
            tile.on_foot_approx_mvt_envelope.z AS z,
            tile.on_foot_approx_mvt_envelope.x AS x,
            tile.on_foot_approx_mvt_envelope.y AS y,
            garmin.on_foot.track_id AS track_id
        FROM tile.on_foot_approx_mvt_envelope
            INNER JOIN garmin.on_foot
                ON ST_Intersects(
                    garmin.on_foot.track,
                    tile.on_foot_approx_mvt_envelope.envelope
                )
        WHERE z = 16
    ),

    -- all tile coordinates with corresponding track ids
    -- bottom-up recursive CTE (zoom level 16 to zoom level 0)
    tile_coords (z, x, y, track_id) AS (
        SELECT * FROM z16_tiles
        UNION
        SELECT z - 1, x / 2, y / 2, track_id
        FROM tile_coords
        WHERE z > 0
    )

    -- sorted mapping
    SELECT *
    FROM tile_coords
    ORDER BY z, x, y ASC
)
WITH NO DATA;
CREATE INDEX IF NOT EXISTS on_foot_mvt_intersection_zxy_idx
    ON tile.on_foot_mvt_intersection USING btree (z, x, y);
REFRESH MATERIALIZED VIEW tile.on_foot_mvt_intersection;




-- set of mvt envelopes with exact covering of "on foot" track geometry
DROP VIEW IF EXISTS tile.on_foot_mvt_envelope CASCADE;
CREATE VIEW tile.on_foot_mvt_envelope AS (
    SELECT *
    FROM (
        SELECT
            z, x, y,
            count(track_id) AS intersections,
            ST_Transform(ST_TileEnvelope(z, x, y), 4326) AS envelope
        FROM tile.on_foot_mvt_intersection
        GROUP BY z, x, y
    )
    ORDER BY intersections DESC, z, x, y ASC
);
