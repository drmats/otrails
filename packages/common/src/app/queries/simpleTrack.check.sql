--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
SELECT count(*) > 0 AS track_found
FROM track.simple
WHERE source_name = $<source_name>;
