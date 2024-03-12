/**
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { type FC, useCallback, useMemo, useReducer } from "react";
import {
    isArray,
    isBoolean,
    isObject,
    isString,
    toBool,
} from "@xcmats/js-toolbox/type";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import type { ExtendedValue } from "~common/lib/type";
import { recordKeys, type ExtendedRecord } from "~common/lib/struct";
import type { StyleOverrides } from "~web/common/types";
import { sxStyles } from "~web/common/utils";
import { BreakOnSymbol } from "~web/common/components/BreakOnSymbol";
import { NBSP } from "~common/lib/string";




/**
 * ...
 */
const sx = sxStyles({
    container: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
    },
    plainNode: {
        display: "flex",
        ml: 2,
        flexDirection: "row",
        "& p:first-of-type": { textAlign: "right" },
    },
    node: {
        display: "flex",
        ml: 2,
        flexDirection: "column",
        alignItems: "flex-start",
    },
    label: (th) => ({
        mr: 1,
        fontWeight: 500,
        color: th.palette.text.secondary,
        overflowWrap: "break-word",
    }),
    clickable: (th) => ({
        cursor: "pointer",
        "&:hover": {
            textDecoration: "underline",
            color: th.palette.primary.main,
        },
    }),
    plainValue: (th) => ({
        fontWeight: 500,
        color: th.palette.text.primary,
        overflowWrap: "break-word",
    }),
    groupFrame: {
        position: "relative",
    },
    visibleFrame: (th) => ({
        position: "absolute",
        top: th.spacing(1),
        left: 0,
        width: th.spacing(1),
        height: `calc(100% - ${th.spacing(2)})`,
        borderTop: `1px solid ${th.palette.text.secondary}`,
        borderLeft: `1px solid ${th.palette.text.secondary}`,
        borderBottom: `1px solid ${th.palette.text.secondary}`,
    }),
    clickableFrame: (th) => ({
        cursor: "pointer",
        "&:hover": {
            borderTop: `1px solid ${th.palette.primary.main}`,
            borderLeft: `1px solid ${th.palette.primary.main}`,
            borderBottom: `1px solid ${th.palette.primary.main}`,
        },
    }),
    rounded: {
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
    },
    nodesFrame: { pr: 0 },
});




/**
 * How many entries array/object has to contain to be folded by default?
 */
const FOLD_ABOVE = 8;




/**
 * <wbr /> insertion chunk sizes.
 */
const LABEL_CHUNK = 10;
const VALUE_CHUNK = 6;




/**
 * Basic and unknowns.
 */
const PlainNode: FC<{
    label?: string;
    value?: string | number | boolean | unknown;
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ label, value, overrides }) => (
    <Box sx={[sx.plainNode, overrides?.plainNode ?? {}]}>
        { label && (
            <Typography
                variant="body2"
                sx={[sx.label, overrides?.label ?? {}]}
            >
                <BreakOnSymbol
                    txt={label}
                    breaks=""
                    chunkSize={LABEL_CHUNK}
                />{ ":" }
            </Typography>
        ) }
        <Typography
            variant="body2"
            sx={[sx.plainValue, overrides?.plainValue ?? {}]}
        >
            <BreakOnSymbol
                txt={
                    isString(value)
                        ? `"${value}"`
                        : value instanceof Date
                            ? value.toISOString()
                            : typeof value === "undefined"
                                ? "undefined"
                                : JSON.stringify(value)
                }
                breaks=""
                chunkSize={VALUE_CHUNK}
            />
        </Typography>
    </Box>
);




/**
 * Objects.
 */
const ObjectNode: FC<{
    label?: string;
    value: { [key: string]: ExtendedValue | undefined };
    initiallyUnfolded?: boolean;
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ label, value, initiallyUnfolded, overrides }) => {
    const valueKeys = useMemo(() => recordKeys(value), [value]);
    const [folded, toggle] = useReducer(
        (s) => !s,
        isBoolean(initiallyUnfolded)
            ? toBool(!initiallyUnfolded)
            : valueKeys.length > FOLD_ABOVE || valueKeys.length <= 1,
    );
    const handleClick = useCallback(() => {
        if (valueKeys.length !== 0) toggle();
    }, [valueKeys]);
    const node = useCallback((l: string | number) => (
        <Node
            key={l}
            label={String(l)}
            value={value[l]}
            initiallyUnfolded={initiallyUnfolded}
            overrides={overrides}
        />
    ), [initiallyUnfolded, overrides, value]);

    return (
        <Box
            sx={
                folded
                    ? [sx.plainNode, overrides?.plainNode ?? {}]
                    : [sx.node, overrides?.node ?? {}]
            }
        >
            { label && (
                <Typography
                    variant="body2"
                    sx={[
                        sx.label, valueKeys.length !== 0 ? sx.clickable : {},
                        overrides?.label ?? {},
                        valueKeys.length !== 0
                            ? overrides?.clickable ?? {}
                            : {},
                    ]}
                    onClick={valueKeys.length !== 0 ? handleClick : undefined}
                >
                    <BreakOnSymbol
                        txt={label}
                        breaks=""
                        chunkSize={LABEL_CHUNK}
                    />{ ":" }
                    { !folded ? `${NBSP}{${NBSP}${valueKeys.length}${NBSP}}` : ""}
                </Typography>
            ) }
            { folded ? (
                <Typography
                    variant="body2"
                    sx={[
                        sx.plainValue,
                        valueKeys.length !== 0 ? sx.clickable : {},
                        overrides?.plainValue ?? {},
                        valueKeys.length !== 0
                            ? overrides?.clickable ?? {}
                            : {},
                    ]}
                    onClick={valueKeys.length !== 0 ? handleClick : undefined}
                >
                    { `{${NBSP}${
                        valueKeys.length
                    }${NBSP}${
                        valueKeys.length === 1 ? "entry" : "entries"
                    }${NBSP}}` }
                </Typography>
            ) : valueKeys.length > 1 ? (
                <Box sx={sx.groupFrame}>
                    <Box
                        sx={[sx.visibleFrame, sx.rounded, sx.clickableFrame]}
                        onClick={handleClick}
                    />
                    <Box sx={sx.nodesFrame}>
                        { valueKeys.map(node) }
                    </Box>
                </Box>
            ) : valueKeys.map(node) }
        </Box>
    );
};




/**
 * Arrays.
 */
const ArrayNode: FC<{
    label?: string;
    values: (ExtendedValue | undefined)[];
    initiallyUnfolded?: boolean;
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ label, values, initiallyUnfolded, overrides }) => {
    const [folded, toggle] = useReducer(
        (s) => !s,
        isBoolean(initiallyUnfolded)
            ? toBool(!initiallyUnfolded)
            : values.length > FOLD_ABOVE || values.length <= 1,
    );
    const handleClick = useCallback(() => {
        if (values.length !== 0) toggle();
    }, [values]);
    const node = useCallback((v: ExtendedValue | undefined, i: number) => {
        if (isArray(v)) return (
            <ArrayNode
                key={`${v.join(",")}-${i}`}
                values={v}
                initiallyUnfolded={initiallyUnfolded}
                overrides={overrides}
            />
        );
        if (
            isObject(v) &&
            Object.keys(v).length > 0 &&
            !(v instanceof Date)
        ) return (
            <ObjectNode
                key={`${String(Object.entries(v))}-${i}`}
                value={v}
                initiallyUnfolded={initiallyUnfolded}
                overrides={overrides}
            />
        );
        return (
            <PlainNode
                key={`${String(v)}-${i}`}
                value={v}
                overrides={overrides}
            />
        );
    }, [initiallyUnfolded, overrides]);

    return (
        <Box
            sx={
                folded
                    ? [sx.plainNode, overrides?.plainNode ?? {}]
                    : [sx.node, overrides?.node ?? {}]
            }
        >
            { label && (
                <Typography
                    variant="body2"
                    sx={[
                        sx.label, values.length !== 0 ? sx.clickable : {},
                        overrides?.label ?? {},
                        values.length !== 0
                            ? overrides?.clickable ?? {}
                            : {},
                    ]}
                    onClick={values.length !== 0 ? handleClick : undefined}
                >
                    <BreakOnSymbol
                        txt={label}
                        breaks=""
                        chunkSize={LABEL_CHUNK}
                    />{ ":" }
                    { !folded ? `${NBSP}[${NBSP}${values.length}${NBSP}]` : ""}
                </Typography>
            ) }
            { folded ? (
                <Typography
                    variant="body2"
                    sx={[
                        sx.plainValue,
                        values.length !== 0 ? sx.clickable : {},
                        overrides?.plainValue ?? {},
                        values.length !== 0
                            ? overrides?.clickable ?? {}
                            : {},
                    ]}
                    onClick={values.length !== 0 ? handleClick : undefined}
                >
                    { `[${NBSP}${
                        values.length
                    }${NBSP}${
                        values.length === 1 ? "element" : "elements"
                    }${NBSP}]` }
                </Typography>
            ) : values.length > 1 ? (
                <Box sx={sx.groupFrame}>
                    <Box
                        sx={[sx.visibleFrame, sx.clickableFrame]}
                        onClick={handleClick}
                    />
                    <Box sx={sx.nodesFrame}>
                        { values.map(node) }
                    </Box>
                </Box>
            ) : values.map(node) }
        </Box>
    );
};




/**
 * Polymorphic node.
 */
const Node: FC<{
    label: string;
    value?: ExtendedValue;
    initiallyUnfolded?: boolean;
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ label, value, initiallyUnfolded, overrides }) => {
    if (isArray(value)) return (
        <ArrayNode
            label={label}
            values={value}
            initiallyUnfolded={initiallyUnfolded}
            overrides={overrides}
        />
    );
    if (
        isObject(value) &&
        Object.keys(value).length > 0 &&
        !(value instanceof Date)
    ) return (
        <ObjectNode
            label={label}
            value={value}
            initiallyUnfolded={initiallyUnfolded}
            overrides={overrides}
        />
    );
    return (
        <PlainNode label={label} value={value} overrides={overrides} />
    );
};




/**
 * ExtendedRecord visual inspector.
 */
const FreeFormInspect: FC<{
    data: ExtendedRecord;
    unfolded?: boolean;
    overrides?: StyleOverrides<keyof typeof sx>;
}> = ({ data, unfolded, overrides }) => {
    const dataKeys = useMemo(() => recordKeys(data), [data]);
    return (
        <Box sx={[sx.container, overrides?.container ?? {}]}>
            { dataKeys.map((label) => (
                <Node
                    key={label}
                    label={label}
                    value={data[label]}
                    initiallyUnfolded={
                        unfolded ?? (dataKeys.length === 1 ? true : undefined)
                    }
                    overrides={overrides}
                />
            )) }
        </Box>
    );
};

export default FreeFormInspect;
