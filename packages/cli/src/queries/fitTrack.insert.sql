--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
INSERT INTO garmin.fit_track (
    user_short_id,
    begin_timestamp,
    track
)
VALUES (
    $<user_short_id>,
    $<begin_timestamp>,
    $<track>
)
RETURNING *;
