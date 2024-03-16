/**
 * Otrails - trails, open.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

import { join } from "node:path";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import { isArray, isString } from "@xcmats/js-toolbox/type";

import type { ResponseErr } from "~common/framework/actions";
import type { MapStyleSourcesResponseOk } from "~common/app/actions/map";
import type { MapStyleSource } from "~common/map/types";
import { ThemeVariant, isThemeVariant } from "~common/framework/theme";
import { useMemory } from "~service/logic/memory";
import { isFile, readJSON } from "~common/lib/fs";




/**
 * Public sources.
 */
const PUBLIC_SOURCES = [
    {
        label: "maplibre_demo",
        displayName: "Geography Class",
        url: "https://demotiles.maplibre.org/style.json",
        themeVariant: ThemeVariant.LIGHT,
    },
    {
        label: "ne_vector",
        displayName: "Natural Earth Vector",
        url: "https://klokantech.github.io/naturalearthtiles/maps/natural_earth.vector.json",
        themeVariant: ThemeVariant.LIGHT,
    },
];




/**
 * ...
 */
const ADDITIONAL_SOURCES_FILE = "external-tile-sources.json";




/**
 * List external map style sources.
 */
export const mapStyleSources: RequestHandler<
    ParamsDictionary,
    MapStyleSourcesResponseOk | ResponseErr
> = async (_req, res, next) => {

    const { knownVars } = useMemory();

    const errorStatus = 500;

    try {

        // full path to additional sources file
        const additionalSourcesFile = join(
            knownVars.staticDir,
            ADDITIONAL_SOURCES_FILE,
        );

        // default additional sources content (empty)
        let additionalSources: MapStyleSource[] = [];

        // try reading additional sources file
        if (await isFile(additionalSourcesFile)) {
            try {
                const additionalSourcesFileContent =
                    await readJSON<{ sources: MapStyleSource[] }>(
                        additionalSourcesFile,
                    );
                if (
                    isArray(additionalSourcesFileContent.sources) &&
                    additionalSourcesFileContent.sources.every((s) => (
                        isString(s.label) && isString(s.displayName) &&
                        isString(s.url) && isThemeVariant(s.themeVariant)
                    ))
                ) {
                    additionalSources = additionalSourcesFileContent.sources;
                }
            } catch { /* no-op */ }
        }

        // all ok
        res.status(200).send({
            sources: [...PUBLIC_SOURCES, ...additionalSources],
        });

    } catch (e) {

        if (e instanceof Error) {
            res.status(errorStatus).send({ error: e.message });
        } else {
            res.status(500).send({ error: String(e) });
            return next(e);
        }

    }

    return next();

};
