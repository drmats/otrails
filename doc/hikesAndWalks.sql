--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- start positions and track simplified geometry
-- for all hikes and walks no shorter than 100 m
SELECT start_position AS geom
FROM garmin.hike_or_walk
UNION ALL
SELECT track AS geom
FROM garmin.hike_or_walk;
