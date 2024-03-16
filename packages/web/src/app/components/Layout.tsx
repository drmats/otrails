/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import {
    Suspense,
    type FC,
    type ReactNode,
    useLayoutEffect,
    useMemo,
} from "react";

import Loader from "~web/layout/components/Loader";




/**
 * Application layout wrapper.
 */
const Layout: FC<{
    children: ReactNode;
    guard?: () => void;
    showContent?: boolean;
    showControls?: boolean;
}> = ({ children, guard, showControls, showContent }) => {
    const showAppContent = useMemo(
        () => typeof showContent === "undefined" || showContent,
        [showContent],
    );

    const showTopControls = useMemo(
        () => typeof showControls === "undefined" || showControls,
        [showControls],
    );

    useLayoutEffect(() => { if (guard) guard(); }, [guard]);

    return showAppContent ? (
        <Suspense fallback={<Loader withAppBar={showTopControls} />}>
            { children }
        </Suspense>
    ) : null;
};

export default Layout;
