--
-- @license BSD-2-Clause
-- @copyright Mat. 2024-present
--




-- ...
CREATE SCHEMA IF NOT EXISTS garmin;




-- ...
CREATE TABLE IF NOT EXISTS garmin.fit_track (
    id                                   SERIAL                PRIMARY KEY NOT NULL,
    user_short_id                        TEXT                  NOT NULL,
    begin_timestamp                      TIMESTAMPTZ,
    track                                GEOGRAPHY(Linestring)
);

CREATE UNIQUE INDEX IF NOT EXISTS fit_track_unique_track_idx
    ON garmin.fit_track USING btree (user_short_id, begin_timestamp);

CREATE INDEX IF NOT EXISTS fit_track_user_short_id_idx
    ON garmin.fit_track USING btree (user_short_id);

CREATE INDEX IF NOT EXISTS fit_track_begin_timestamp_idx
    ON garmin.fit_track USING brin (begin_timestamp);
