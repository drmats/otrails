--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
INSERT INTO garmin.image (
    user_short_id,
    image_id,
    activity_id,
    sort_order,
    position,
    photo_date,
    review_status_id
)
VALUES (
    $<user_short_id>,
    $<image_id>,
    $<activity_id>,
    $<sort_order>,
    $<position>,
    $<photo_date>,
    $<review_status_id>
)
RETURNING *;
