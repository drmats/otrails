/**
 * Application root redux types.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

/* eslint-disable @typescript-eslint/ban-types */

import type { Action } from "red-g";
import type { Dispatch, Middleware as BareMiddleware } from "redux";
import type {
    ThunkAction as ReduxThunkAction,
    ThunkDispatch as ReduxThunkDispatch,
} from "redux-thunk";

import type { rootReducer } from "~web/store/root";




/**
 * Redux root state shape.
 */
export type RootState = ReturnType<typeof rootReducer>;




/**
 * ThunkAction type alias.
 */
export type ThunkType<R = Promise<void>> = ReduxThunkAction<
    R,
    RootState,
    Ctx,
    Action
>;




/**
 * ThunkDispatch type alias.
 */
export type ThunkDispatch = ReduxThunkDispatch<RootState, Ctx, Action>;




/**
 * Application middleware type.
 */
export type Middleware<
    DispatchExt = {},
    S = RootState,
    D extends Dispatch = ThunkDispatch,
> = BareMiddleware<DispatchExt, S, D>;
