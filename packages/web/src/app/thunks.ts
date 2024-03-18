/**
 * App component thunks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import i18n from "i18next";

import type { ThunkType } from "~web/store/types";
import { FreeFormRecord } from "~common/lib/type";
import type { MapStyleSource } from "~common/map/types";
import { lex } from "~common/lib/sort";
import { inIframe } from "~web/layout/lib";
import { mapStyleSources } from "~web/map/constants";
import { substitute } from "~common/framework/routing";
import { ThemeVariant } from "~common/framework/theme";
import { ACTION } from "~common/app/api";




/**
 * Application init.
 */
export const initialize = (): ThunkType =>
    async (_d, _getState, { act, logger, tnk }) => {
        // go...
        act.app.INITIALIZING();

        // detect if embedded in iframe, or not
        if (inIframe()) act.layout.SET_IN_IFRAME(true);

        // take care of color theme
        await tnk.layout.readThemePreference();
        await tnk.layout.syncTheme();

        // take care of language
        const themeLanguage = await tnk.layout.detectClientThemeLanguage();

        // fetch map style display name mapping for current language
        const mapStyleDisplayNameMap =
            i18n.getResourceBundle(
                themeLanguage, "MapStyleSource",
            ) as FreeFormRecord<string>;

        // fetch all style sources and sort them
        const additionalStyleSources = [
            ...(await tnk.map.mapStyleSources()).sources,
            ...(await tnk.map.tileRasterSources())
                .map((trs) => ({
                    label: trs,
                    url: substitute(ACTION.mapRasterStyle, {
                        name: trs,
                    }),
                    themeVariant:
                        trs.includes("dark")
                            ? ThemeVariant.DARK
                            : ThemeVariant.LIGHT,
                }) as MapStyleSource),
        ].sort(
            (
                { label: l1, displayName: d1 },
                { label: l2, displayName: d2 },
            ) => lex(
                d1 ?? mapStyleDisplayNameMap[`l_${l1}`] ?? l1,
                d2 ?? mapStyleDisplayNameMap[`l_${l2}`] ?? l2,
            ),
        );

        // register all available map style sources
        act.map.SET_MAPSTYLE_SOURCES([
            ...mapStyleSources,
            ...additionalStyleSources,
        ]);

        // all done
        act.app.READY();
        logger.info("Ready! ✅");
    };
