/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import type { FC } from "react";

import { MDASH, NDASH } from "~common/lib/string";




/**
 * Help breaking words on symbols taking into account maximum "chunk" size
 * by inserting html <wbr /> tag.
 */
export const BreakOnSymbol: FC<{
    txt: string;
    breaks?: string;
    chunkSize?: number;
}> = ({
    txt,
    breaks: inBreaks,
    chunkSize: inChunkSize,
}) => {
    const breaks = inBreaks ?? `@.-+!?/, ${NDASH}${MDASH}`;
    const chunkSize = inChunkSize && inChunkSize > 0 ? inChunkSize : Infinity;

    return txt
        .split(/[\s]+/).join(" ")
        .split("")
        .map((l) => breaks.indexOf(l) !== -1 ? ["br", l] : ["l", l])
        .reduce(
            ([x, ...xs], [k, l]) =>
                k === "l" && x.length + 1 < chunkSize
                    ? [x + l, ...xs]
                    : ["", x + l, ...xs],
            [""],
        )
        .reverse()
        .map(
            (x, i, a) =>
                i !== a.length - 1
                    ? [x, <wbr key={`${x}-${i}`} />]
                    : [x],
        );
};
