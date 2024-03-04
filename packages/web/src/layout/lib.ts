/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */




/**
 * Iframe detection.
 */
export const inIframe = (): boolean => {
    try {
        return window.self !== window.top;
    } catch {
        return true;
    }
};
