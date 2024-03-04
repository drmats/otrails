/**
 * App component selectors.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import type { RootState } from "~web/store/types";
import { AppState } from "~web/app/types";




export const selectError = (s: RootState) => s.app.error;

export const selectReady = (s: RootState) => s.app.state === AppState.READY;

export const selectTick = (s: RootState) => s.app.tick;

export const selectVisible = (s: RootState) => s.app.visible;

export const selectIsDevMode = (s: RootState) => s.app.devmode;

export const selectTopbarTitle = (s: RootState) => s.app.topbarTitle;
