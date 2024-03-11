/**
 * Hook utilities.
 *
 * @license BSD-2-Clause
 * @copyright Mat. 2021-present
 */

import type { DependencyList, EffectCallback, MutableRefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { shuffle, zip } from "@xcmats/js-toolbox/array";
import { delay, interval } from "@xcmats/js-toolbox/async";
import { identity } from "@xcmats/js-toolbox/func";
import { inc } from "@xcmats/js-toolbox/math";
import {
    JUST,
    NOTHING,
    type Maybe,
} from "@xcmats/js-toolbox/option";
import { timeUnit } from "@xcmats/js-toolbox/utils";




/**
 * Returns timestamp of component's first mount.
 */
export const useNow = (): number => {
    const [now] = useState(() => Date.now());
    return now;
};




/**
 * Interval in form of a hook.
 */
export const useInterval = (time = timeUnit.second): number => {
    const
        [memTime] = useState(() => time),
        [now, setNow] = useState(Date.now()),
        stopInterval = useRef<(r: string) => void>(identity);

    // update "now" every second
    useEffect(() => {
        interval(
            () => setNow(Date.now()),
            (c) => { stopInterval.current = c; },
            memTime,
        ).catch(identity);
        return () => { stopInterval.current("stopped"); };
    }, [memTime]);

    return now;
};




/**
 * Shuffler.
 */
export const useShuffle = (what: string): string => {
    const [text, setText] = useState(what);
    const [tick, setTick] = useState(0);
    const isMounted = useIsMounted();

    useEffect(() => {
        void delay(timeUnit.second).then(() => {
            if (isMounted.current) {
                setText((t) => shuffle(t.split("")).join(""));
                setTick((t) => inc(t) % 2);
            }
        });
    }, [tick, isMounted]);

    return text;
};




/**
 * Prevent async updates on unmounted components.
 */
export const useIsMounted = (): MutableRefObject<boolean> => {
    const isMounted = useRef(true);
    useEffect(() => () => { isMounted.current = false; }, []);
    return isMounted;
};




/**
 * Same as react's `useEffect()`, except doesn't do anything on initial
 * component mount.
 */
export const useEffectExceptOnInitialMount = (
    effect: EffectCallback, deps?: DependencyList,
): void => {
    const firstCall = useRef(true);
    useEffect(() => {
        if (firstCall.current) firstCall.current = false;
        else return effect();
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};




/**
 * Invoke passed `action` during rendering phase when a change is detected
 * in the `dependencies` array. It can invoke other state `set` functions
 * effectively updating component during rendering phase and before commit phase.
 *
 * Useful for deriving state from props (and other state) or transforming props.
 *
 * ```
 * When you update a component during rendering, React throws away
 * the returned JSX and immediately retries rendering.
 * ```
 *
 * @see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 * @see https://react.dev/learn/render-and-commit
 */
export const useRenderingEffect = <X>(
    action: () => void,
    deps: readonly X[],
): void => {
    const [prev, setPrev] = useState(deps);
    const firstCall = useRef(true);

    if (firstCall.current) {
        action();
        firstCall.current = false;
    } else if (
        prev.length !== deps.length ||
        zip(prev, deps).some(([p, d]) => !Object.is(p, d))
    ) {
        action();
        setPrev(deps);
    }
};




/**
 * Create ref object that contain the current value of state parameter.
 * Usable for effects that has to be stable while referencing state values.
 */
export const useUpdatingRef = <S>(state: S): MutableRefObject<S> => {
    const ref = useRef(state);
    useRenderingEffect(() => { ref.current = state; }, [state]);
    return ref;
};




/**
 * Returns previous value of observed state.
 */
export const usePreviousValue = <T>(val: T): Maybe<T> => {
    const [prev, setPrev] = useState<Maybe<T>>(NOTHING);
    const firstCall = useRef(true);

    useRenderingEffect(() => {
        if (firstCall.current) firstCall.current = false;
        else setPrev(JUST(val));
    }, [val]);

    return prev;
};




/**
 * Maintain number of changes of observed state.
 */
export const useChangeCounter = <T>(val: T): number => {
    const [changes, setChanges] = useState(1);
    const firstCall = useRef(true);

    useRenderingEffect(() => {
        if (firstCall.current) firstCall.current = false;
        else setChanges((c) => c + 1);
    }, [val]);

    return changes;
};




/**
 * Create callback scheduling provided function to be invoked
 * on next rendering cycle. To be used in scenarios causing
 * "Cannot update a component while rendering a different component"
 * warnings.
 */
export const useAsyncCallback = (
    f: () => void,
    deps: DependencyList,
): (() => void) => {
    const [tick, setTick] = useState(0);
    const firstCall = useRef(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fc = useCallback(f, deps);
    useRenderingEffect(() => {
        if (firstCall.current) firstCall.current = false;
        else setTick(0);
    }, [fc]);
    useEffect(() => { if (tick > 0) fc(); }, [tick, fc]);

    const tickle = useCallback(() =>  { setTick((t) => inc(t % 2)); }, []);

    return tickle;
};
