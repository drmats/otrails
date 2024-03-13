--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS track;
CREATE EXTENSION IF NOT EXISTS pgcrypto;




-- ...
CREATE TABLE IF NOT EXISTS track.simple (
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

CREATE INDEX IF NOT EXISTS simple_created_at_idx
    ON track.simple USING brin (created_at);

CREATE INDEX IF NOT EXISTS simple_user_short_id_idx
    ON track.simple USING btree (user_short_id);

CREATE UNIQUE INDEX IF NOT EXISTS simple_source_name_idx
    ON track.simple USING btree (source_name);

CREATE INDEX IF NOT EXISTS simple_sport_idx
    ON track.simple USING btree (sport);

CREATE INDEX IF NOT EXISTS simple_begin_timestamp_idx
    ON track.simple USING brin (begin_timestamp);

CREATE INDEX IF NOT EXISTS simple_line_gix
    ON track.simple USING gist (line);

CREATE UNIQUE INDEX IF NOT EXISTS simple_unique_line_idx
    ON track.simple USING btree (
        user_short_id,
        digest(ST_AsBinary(line), 'sha256')
    );
