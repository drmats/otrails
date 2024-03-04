/**
 * @license BSD-2-Clause
 * @copyright Mat. 2020-present
 */




/**
 * Plain dimensions (html element, window, etc.).
 */
export type Dimensions = {
    width: number;
    height: number;
};




/**
 * Dimensions-object build helper.
 */
export const dimensions = (width: number, height: number): Dimensions =>
    ({ width, height });




/**
 * All redux-stored dimensions.
 */
export type LayoutDimensions = {
    windowInner: Dimensions;
    windowOuter: Dimensions;
    html: Dimensions;
};
