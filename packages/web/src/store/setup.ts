/**
 * Redux logic.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */

import type { Store } from "redux";
import {
    bindActionCreatorsTree,
    defineActionCreator,
    type Action,
} from "red-g";
import { share } from "mem-box";
import { applyMiddleware, legacy_createStore as createStore } from "redux";
import throttle from "lodash.throttle";
import { isFunction } from "@xcmats/js-toolbox/type";
import { devEnv } from "@xcmats/js-toolbox/utils";

import { appMemory } from "~web/root/memory";
import { isComplexValue } from "~common/lib/type";
import { deepConform, deepMerge, isComplexRecord } from "~common/lib/struct";
import { SS_SAVE_THROTTLING_TIME } from "~web/root/config";
import { action, rootReducer, thunk } from "~web/store/root";
import { overrides } from "~web/store/state";
import { attachListeners } from "~web/store/listeners";
import type { RootState, ThunkDispatch } from "~web/store/types";
import {
    getComposer,
    loadStateFromSessionStorage,
    saveStateToSessionStorage,
} from "~web/store/tools";
import assemblyMiddlewares from "~web/store/middlewares";




/**
 * Create and configure redux store.
 */
export const createReduxStore = (): Store<RootState, Action> => {

    const

        // state initialization (hydrated with session storage data)
        initialState = loadStateFromSessionStorage((loadedState) => {
            // construct vanilla init state from states defined in code
            const rawInitialState = rootReducer(
                undefined, defineActionCreator("init"),
            );

            // check if it's serializable
            if (isComplexValue(rawInitialState)) {

                // conform data loaded from persistent memory
                // to template/vanilla state (no extra keys, no wrong types)
                const loadedStateConformed = deepConform(
                    rawInitialState, loadedState,
                    { loose: true, allowEmptyGrowth: true },
                );

                // conform state overrides (defaults) to template state
                const stateOverridesConformed = deepConform(
                    rawInitialState, overrides,
                    { loose: true },
                );

                // overwrite defults over data retrieved from session
                const loadedStateWithOverridesConformed = deepMerge(
                    loadedStateConformed ?? {},
                    stateOverridesConformed ?? {},
                    { allowGrowth: true },
                );

                // ensure all keys required by state shape are present
                const finalState = deepMerge(
                    rawInitialState, loadedStateWithOverridesConformed,
                    { allowGrowth: true },
                );

                // final check
                if (isComplexRecord(finalState)) return finalState;

            }

            // eslint-disable-next-line no-console
            devEnv() && console.error("store state is not serializable");

            return undefined;
        }),


        // store enchancers
        enchancers = getComposer() (
            applyMiddleware(...assemblyMiddlewares()),
        ),


        // redux store
        store = createStore(
            rootReducer,
            initialState,
            enchancers,
        ),


        // bound actions tree
        act = bindActionCreatorsTree(action, store.dispatch as ThunkDispatch),


        // bound thunks tree
        tnk = bindActionCreatorsTree(thunk, store.dispatch as ThunkDispatch),


        // all-sub-states resetting action
        resetState = () => Object.entries(act).forEach(([_, branch]) => {
            if (isFunction(branch.RESET)) branch.RESET();
        });


    // share bound action trees with resetState() helper
    share({ act, tnk, resetState, rootReducer });


    // attach all external-world event listeners
    attachListeners(store.dispatch, store.getState, appMemory());


    // periodically save state in session storage
    store.subscribe(throttle(
        () => saveStateToSessionStorage(store.getState()),
        SS_SAVE_THROTTLING_TIME,
    ));


    return store;

};




/**
 * Global declaration merge.
 */
declare global {

    /**
     * Shared memory context.
     */
    interface Ctx {
        readonly act: ReturnType<typeof bindActionCreatorsTree<typeof action>>;
        readonly tnk: ReturnType<typeof bindActionCreatorsTree<typeof thunk>>;
        readonly resetState: () => void;
        readonly rootReducer: typeof rootReducer;
    }

}
