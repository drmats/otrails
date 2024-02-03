--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
SELECT count(*) > 0 AS track_found
FROM garmin.simple_track
WHERE source_name = $<source_name>;
