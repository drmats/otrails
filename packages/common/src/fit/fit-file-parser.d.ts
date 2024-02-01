/**
 * @license BSD-2-Clause
 * @copyright Mat. 2024-present
 */

/**
 * Type definitions for fit-file-parser.
 */
declare module "fit-file-parser" {

    /**
     * Parsed fit-file shape.
     */
    export type FitObject = Record<string, unknown>;

    /**
     * Default fit-file parsing class.
     */
    export default class FitParser {
        constructor (options?: {
            force?: boolean;
            speedUnit?: "m/s" | "mph" | "km/h";
            lengthUnit?: "m" | "mi" | "km";
            temperatureUnit?: "celsius" | "kelvin" | "fahrenheit";
            elapsedRecordField?: boolean;
            mode: "list" | "cascade" | "both";
        });

        parse (
            content: Buffer,
            callback: (err: string | null, data: FitObject) => void,
        ): void;
    }

}
