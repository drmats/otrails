--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
DELETE FROM garmin.image
WHERE
    user_short_id = $<user_short_id> AND
    image_id = $<image_id>;
