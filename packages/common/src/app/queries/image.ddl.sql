--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS garmin;




-- ...
CREATE TABLE IF NOT EXISTS garmin.image (
    id                SERIAL             PRIMARY KEY NOT NULL,
    created_at        TIMESTAMPTZ        NOT NULL DEFAULT now(),
    user_short_id     TEXT               NOT NULL,
    image_id          TEXT               NOT NULL,
    activity_id       BIGINT             NOT NULL,
    sort_order        INT                NOT NULL,
    position          GEOGRAPHY(Point),
    photo_date        TIMESTAMPTZ,
    review_status_id  INT
);

CREATE INDEX IF NOT EXISTS image_created_at_idx
    ON garmin.image USING brin (created_at);

CREATE INDEX IF NOT EXISTS image_user_short_id_idx
    ON garmin.image USING btree (user_short_id);

CREATE UNIQUE INDEX IF NOT EXISTS image_id_idx
    ON garmin.image USING btree (image_id);

CREATE INDEX IF NOT EXISTS image_activity_id_idx
    ON garmin.image USING btree (activity_id);

CREATE INDEX IF NOT EXISTS image_position_gix
    ON garmin.image USING gist (position);

CREATE INDEX IF NOT EXISTS image_photo_date_idx
    ON garmin.image USING brin (photo_date);
