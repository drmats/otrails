--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
INSERT INTO garmin.simple_track (
    user_short_id,
    source_type,
    source_name,
    activity_timestamp,
    sport,
    begin_timestamp,
    line
)
VALUES (
    $<user_short_id>,
    $<source_type>,
    $<source_name>,
    $<activity_timestamp>,
    $<sport>,
    $<begin_timestamp>,
    $<line>
)
RETURNING *;
