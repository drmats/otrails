--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS garmin;




-- ...
CREATE TABLE IF NOT EXISTS garmin.simple_track (
    id                                   SERIAL         PRIMARY KEY NOT NULL,
    created_at                           TIMESTAMPTZ    NOT NULL DEFAULT now(),
    user_short_id                        TEXT           NOT NULL,
    source_type                          TEXT,
    source_name                          TEXT,
    activity_timestamp                   TIMESTAMPTZ,
    sport                                TEXT,
    begin_timestamp                      TIMESTAMPTZ,
    line                                 GEOMETRY(Linestring, 4326)
);

CREATE INDEX IF NOT EXISTS simple_track_created_at_idx
    ON garmin.simple_track USING brin (created_at);

CREATE INDEX IF NOT EXISTS simple_track_user_short_id_idx
    ON garmin.simple_track USING btree (user_short_id);

CREATE UNIQUE INDEX IF NOT EXISTS simple_track_source_name_idx
    ON garmin.simple_track USING btree (source_name);

CREATE INDEX IF NOT EXISTS simple_track_sport_idx
    ON garmin.simple_track USING btree (sport);

CREATE INDEX IF NOT EXISTS simple_track_begin_timestamp_idx
    ON garmin.simple_track USING brin (begin_timestamp);

CREATE INDEX IF NOT EXISTS simple_track_line_gix
    ON garmin.simple_track USING gist (line);
