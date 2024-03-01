/**
 * Global redux hooks.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import { useDispatch } from "react-redux";

import type { ThunkDispatch } from "~web/store/types";




/**
 * Correctly typed dispatch for thunk use.
 */
export const useThunkDispatch = useDispatch as () => ThunkDispatch;
