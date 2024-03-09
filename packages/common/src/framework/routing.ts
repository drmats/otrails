/**
 * Routing.
 *
 * @module @xcmats/framework-routing
 * @license BSD-2-Clause
 * @copyright Mat. 2023-present
 */

import { head, tail } from "@xcmats/js-toolbox/array";
import { isNumber, isObject, isString } from "@xcmats/js-toolbox/type";

import { recordKeys, sortRecord, type PlainRecord } from "~common/lib/struct";




/**
 * Route label types.
 */
type RLabelTerminal = "t()";
type RLabelStatic<V extends string = string> = `s(${V})`;
type RLabelParam = "p(X)";
type RLabel = RLabelTerminal | RLabelStatic | RLabelParam;




/**
 * Route label generators.
 */
const makeRLabelTerminal = (): RLabelTerminal => "t()";
const makeRLabelStatic = (el: string): RLabelStatic => `s(${el})`;
const makeRLabelParam = (): RLabelParam => "p(X)";




/**
 * Route token types.
 */
type RTokenTerminal = {
    kind: "terminal";
    label: RLabelTerminal;
};
type RTokenStatic = {
    kind: "static";
    label: RLabelStatic;
    value: string;
};
type RTokenParam = {
    kind: "param";
    label: RLabelParam;
    value: string;
};
type RToken = RTokenTerminal | RTokenStatic | RTokenParam;




/**
 * Route token type predicates.
 */
const isRTokenTerminal = (el?: RToken): el is RTokenTerminal =>
    isObject(el) && el.kind === "terminal";
const isRTokenStatic = (el?: RToken): el is RTokenStatic =>
    isObject(el) && el.kind === "static";
const isRTokenParam = (el?: RToken): el is RTokenParam =>
    isObject(el) && el.kind === "param";




/**
 * Route token generators.
 */
const makeRTokenTerminal = (): RTokenTerminal => ({
    kind: "terminal", label: makeRLabelTerminal(),
});
const makeRTokenStatic = (el: string): RTokenStatic => ({
    kind: "static", label: makeRLabelStatic(el), value: el,
});
const makeRTokenParam = (el: string): RTokenParam => ({
    kind: "param", label: makeRLabelParam(), value: tail(el),
});
const makeRToken = (el: string): RToken => {
    if (el === "") return makeRTokenTerminal();
    if (el.startsWith(":")) return makeRTokenParam(el);
    return makeRTokenStatic(el);
};




/**
 * Convert RToken to string.
 */
const renderRToken = (token: RToken): string =>
    isRTokenTerminal(token)
        ? ""
        : isRTokenStatic(token)
            ? token.value
            : `:${token.value}`;




/**
 * Route tree types.
 */
type RNodeTerminal = { token: RTokenTerminal };
type RNodeStatic = {
    token: RTokenStatic;
    children: Record<RLabel, RTree>;
};
type RNodeParam = {
    token: RTokenParam;
    children: Record<RLabel, RTree>;
};
export type RTree = RNodeTerminal | RNodeStatic | RNodeParam;




/**
 * Route tree type predicates.
 */
const isRNodeTerminal = (el?: RTree): el is RNodeTerminal =>
    isObject(el) && isRTokenTerminal(el.token);
const isRNodeStatic = (el?: RTree): el is RNodeStatic =>
    isObject(el) && isRTokenStatic(el.token);
const isRNodeParam = (el?: RTree): el is RNodeParam =>
    isObject(el) && isRTokenParam(el.token);




/**
 * Route tree generators.
 */
export const makeEmptyRTree = (): RNodeTerminal => ({
    token: makeRTokenTerminal(),
});




/**
 * Convert route into array of route tokens.
 * Route has to be with leading and trailing slashes.
 */
const tokenizeRoute = (route: string): RToken[] => {
    if (route === "" || !route.startsWith("/") || !route.endsWith("/"))
        throw new Error("wrong route");
    return [
        makeRTokenStatic("/"),
        ...tail(route.replace(/\/+/g, "/")).split("/").map(makeRToken),
    ];
};




/**
 * Create new route tree based on provided one and route splitted to segments.
 */
const addToRTree = (node: RTree, tokens: RToken[]): RTree => {
    if (tokens.length === 0) return node;
    const token = head(tokens);

    if (isRNodeTerminal(node)) {

        // node - terminal, token - terminal
        if (isRTokenTerminal(token)) return { token } as RTree;

        // node - terminal, token - static or param
        const newNode = addToRTree(
            makeEmptyRTree(), tail(tokens),
        );
        return {
            token: token,
            children: { [newNode.token.label]: newNode },
        } as RTree;

    } else {

        // node - static or param, token - terminal
        if (isRTokenTerminal(token)) {
            return {
                token: node.token,
                children: sortRecord({
                    ...node.children,
                    [token.label]: { t: token },
                }),
            } as RTree;
        }

        // node - static or param, token - static or param - IDENTICAL
        if (node.token.label === token.label) {

            const rest = tail(tokens);
            if (rest.length > 0) {

                const nextTokenLabel = head(rest).label;
                const nodeChild = node.children[nextTokenLabel];

                // node child and token child are IDENTICAL - descent
                if (nodeChild) {
                    return {
                        token: node.token,
                        children: sortRecord({
                            ...node.children,
                            [nextTokenLabel]: addToRTree(nodeChild, rest),
                        }),
                    } as RTree;
                }

                // node doesn't have child identical to token's child
                const newNode = addToRTree(
                    makeEmptyRTree(), rest,
                );
                const nodeChildren = Object.values(node.children);
                const spread = (
                    (isRNodeStatic(newNode) || isRNodeTerminal(newNode)) &&
                    nodeChildren.every(
                        (c) => isRNodeStatic(c) || isRNodeTerminal(c),
                    )
                ) || (
                    (isRNodeParam(newNode)) &&
                    nodeChildren.every((c) => isRNodeTerminal(c))
                ) || (
                    (isRNodeTerminal(newNode)) &&
                    nodeChildren.every((c) => isRNodeParam(c))
                );
                const terminalChild = node.children[makeRLabelTerminal()];
                return {
                    token: node.token,
                    children: sortRecord({
                        ...(isRNodeTerminal(terminalChild)
                            ? { [makeRLabelTerminal()]: terminalChild }
                            : {}
                        ),
                        ...(spread ? node.children : {}),
                        [newNode.token.label]: newNode,
                    }),
                } as RTree;

            }

            return node;
        }

        // node - static or param, token - static or param - DIFFERENT
        return {
            token: node.token,
            children: sortRecord({
                ...node.children,
                [token.label]: addToRTree(
                    { token: token, children: {} } as RTree,
                    tail(tokens),
                ),
            }),
        } as RTree;
    }
};




/**
 * Build new route tree based on provided array of routes.
 * Routes have to be with leading and trailing slashes.
 */
export const buildRTree = (routes: string[]): RTree => {
    let rt: RTree = makeEmptyRTree();

    routes.forEach((route) => {
        rt = addToRTree(rt, tokenizeRoute(route));
    });

    return rt;
};




/**
 * Walk provided route tree and produce array of routes.
 */
export const getAllRoutes = (tree: RTree): string[] => {
    const tokens: RToken[][] = [];

    const aux = (node: RTree, current: RToken[] = []): void => {
        if (isRNodeTerminal(node)) {
            tokens.push(current);
            return;
        }
        recordKeys(node.children).forEach((label) => aux(
            node.children[label],
            [...current, node.children[label].token],
        ));
    };

    aux(tree);

    return tokens.map((tt) => `/${tt.map(renderRToken).join("/")}`).sort();
};




/**
 * `matchRoute()` return type.
 */
export type MatchRouteResult = {
    matched: string;
    params: Partial<Record<string, string>>;
};




/**
 * Match route against route tree.
 * If there is no match, then `result.matched` consists of empty string ("").
 */
export const matchRoute = (tree: RTree, route: string): MatchRouteResult => {
    let
        outTokens: RToken[] = [],
        params: Partial<Record<string, string>> = {};

    const aux = (node: RTree, inTokens: RToken[]): void => {
        if (isRNodeTerminal(node) || inTokens.length <= 1) {
            if (
                inTokens.length === 0 ||
                (isRNodeTerminal(node) && !isRTokenTerminal(head(inTokens)))
            ) {
                outTokens = []; params = {};
            } else {
                outTokens.push(node.token);
            }
            return;
        }

        const inToken = head(inTokens);
        const restTokens = tail(inTokens);
        const nextToken = head(restTokens);
        const nextLabel =
            node.children[nextToken.label]
                ? nextToken.label
                : (
                    (isRTokenStatic(nextToken) || isRTokenParam(nextToken)) &&
                    node.children[makeRLabelParam()]
                )
                    ? makeRLabelParam()
                    : (
                        isRTokenTerminal(nextToken) &&
                        node.children[makeRLabelTerminal()]
                    )
                        ? makeRLabelTerminal()
                        : undefined;

        if (nextLabel) {
            if (
                isRNodeStatic(node) && isRTokenStatic(inToken) &&
                node.token.value === inToken.value
            ) {
                outTokens.push(node.token);
                return aux(node.children[nextLabel], restTokens);
            } else if (
                isRNodeParam(node) && (
                    isRTokenStatic(inToken) || isRTokenParam(inToken)
                )
            ) {
                params[node.token.value] =
                    isRTokenStatic(inToken)
                        ? inToken.value
                        : `:${inToken.value}`;
                outTokens.push(node.token);
                return aux(node.children[nextLabel], restTokens);
            }
        } else {
            outTokens = []; params = {};
        }
    };

    aux(tree, tokenizeRoute(route));

    return {
        matched:
            outTokens.length > 0
                ? `/${tail(outTokens).map(renderRToken).join("/")}`
                : "",
        params,
    };
};




/**
 * Substitute route parameters with provided values.
 */
export const substitute = (
    route: string,
    params?: Partial<Record<string, string>>,
): string => {
    if (!isObject(params)) return route;

    const allParams = Object.entries(params);
    const allLabels = allParams.map(([l]) => `:${l}`);
    let replaced = route;

    allParams.forEach(([label, value]) => {
        if (isString(value) && !allLabels.includes(value)) {
            replaced = replaced.replaceAll(`:${label}`, value);
        }
    });

    return replaced;
};




/**
 * Parse query string and return key-val mapping.
 */
export const parseQueryString = (
    queryString: string,
    opts?: {
        pairSep?: string;
        fieldSep?: string;
        omitDecoding?: boolean;
    },
): PlainRecord => {
    const pairSep = opts?.pairSep ?? "&";
    const fieldSep = opts?.fieldSep ?? "=";
    let decodedQueryString = "";

    if (queryString === "") return {};

    try {
        decodedQueryString =
            opts?.omitDecoding
                ? queryString
                : decodeURIComponent(queryString);
    } catch { /* no-op */ }

    const mapping: PlainRecord = {};

    decodedQueryString.split(pairSep).forEach((pair) => {
        const [k, v] = pair.split(fieldSep);
        if (isString(k)) {
            if (isString(v)) {
                const vn = Number(v);
                if (isNumber(vn)) mapping[k] = vn;
                else mapping[k] = v;
            }
            else mapping[k] = true;
        }
    });

    return mapping;
};




/**
 * Stringify query key-val mapping into string.
 */
export const stringifyQuery = (
    query: PlainRecord,
    opts?: {
        pairSep?: string;
        fieldSep?: string;
        encode?: boolean;
    },
): string => {
    const pairSep = opts?.pairSep ?? "&";
    const fieldSep = opts?.fieldSep ?? "=";

    const queryString =
        Object.entries(query)
            .filter(([, v]) =>
                (isString(v) && v !== "") || isNumber(v) || v === true,
            )
            .map(([k, v]) => `${k}${fieldSep}${v}`)
            .join(pairSep);

    let encodedQueryString = "";

    try {
        encodedQueryString =
            opts?.encode
                ? encodeURIComponent(queryString)
                : queryString;
    } catch { /* no-op */ }

    return encodedQueryString;
};
