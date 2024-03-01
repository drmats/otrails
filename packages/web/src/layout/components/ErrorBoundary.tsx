/**
 * @license BSD-2-Clause
 * @copyright Mat. 2022-present
 */

import { Component, type ErrorInfo, type ReactNode } from "react";

import { appMemory } from "~web/root/memory";
import ErrorScreen from "~web/layout/screens/Error";




/**
 * Error boundary props.
 */
interface Props {
    children?: ReactNode;
}




/**
 * Error boundary state.
 */
interface State {
    error: boolean;
}




/**
 * Error boundary for failed lazy/suspense screens.
 */
class ErrorBoundary extends Component<Props, State> {

    constructor (props: Readonly<Props>) {
        super(props);
        this.state = { error: false };
    }

    static getDerivedStateFromError (_error: Error): State {
        return { error: true };
    }

    componentDidCatch (error: Error, errorInfo: ErrorInfo): void {
        const { logger } = appMemory();
        logger.error(error, errorInfo);
    }

    render (): ReactNode {
        if (this.state.error) return (
            <ErrorScreen message="Error:network_error" />
        );
        return this.props.children;
    }

}

export default ErrorBoundary;
