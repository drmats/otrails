/**
 * JWT/Basic authentication mechanism.
 *
 * @module @xcmats/express-auth
 * @license BSD-2-Clause
 * @copyright Mat. 2019-present
 */

/* eslint-disable @typescript-eslint/no-namespace */

import type { RequestHandler } from "express";
import { share } from "mem-box";
import { b64dec, b64enc, b64ToString } from "@xcmats/js-toolbox/codec";
import { isString } from "@xcmats/js-toolbox/type";

import { useMemory } from "~service/logic/memory";
import {
    emptyBearer,
    emptyToken,
    type BearerToken,
    type DecodedBearerToken,
} from "~common/app/jwt";
import { System } from "~common/app/models/setting";
import { HttpMessage } from "~common/framework/http";




/**
 * Authentication configuration.
 */
export default function configureAuth (
    jwtKey: Uint8Array,
    basicAuthUserPass: string,
): void {

    // app objects
    const { firstWorker, logger, model } = useMemory();

    if (firstWorker) logger.write("[auth] ... ");




    // in-database stored jwt key
    const storedKey = model.setting.get(System.MASTER_KEY);

    // currently used key
    let workJwtKey = jwtKey;

    // choose either stored key or use new one if stored key does not exist
    if (isString(storedKey)) {
        try { workJwtKey = b64dec(storedKey); }
        catch { model.setting.set(System.MASTER_KEY, b64enc(jwtKey)); }
    } else {
        model.setting.set(System.MASTER_KEY, b64enc(jwtKey));
    }




    // authentication middleware generator - JWT
    const jwtAuthMw: (required: boolean) => RequestHandler = (
        required,
    ) => async (req, res, next) => {

        if (required) {
            res.status(401).send({ error: HttpMessage.C401noauth });
            return next(new Error(HttpMessage.C401noauth));
        } else {
            req.xauth = { ...emptyToken, ...emptyBearer };
            req.xbasic = ":";
            return next();
        }

    };




    // in-database stored basic auth user:pass pair
    const storedBasicUserPass = model.setting.get(System.BASIC_AUTH);

    // currently used basic auth user:pass pair
    let workBasicUserPass = basicAuthUserPass;

    // choose either stored user:pass or use new one if stored does not exist
    if (isString(storedBasicUserPass)) {
        workBasicUserPass = storedBasicUserPass;
    } else {
        model.setting.set(System.BASIC_AUTH, basicAuthUserPass);
    }




    // authentication middleware generator - basic
    const basicAuthMw: () => RequestHandler = () => async (req, res, next) => {

        const [user, pass] = workBasicUserPass.split(":");

        const authField = req.get("Authorization");

        if (authField) {

            const token = authField.replace(
                /Basic (.*)/, (_, m: string) => m,
            );

            try {

                req.xauth = { ...emptyToken, ...emptyBearer };
                const [u, p] = b64ToString(token).split(":");
                if (u === user && p === pass) {
                    req.xbasic = workBasicUserPass;
                    return next();
                }
                else throw new Error(HttpMessage.C401noauth);

            } catch (e) {

                res.status(401).send({
                    error: e instanceof Error ?
                        e.message : HttpMessage.C401noauth,
                });
                return next(e);

            }

        } else {

            res.status(401).send({ error: HttpMessage.C401noauth });
            return next(new Error(HttpMessage.C401noauth));

        }

    };




    // augment auth object with middlewares
    const auth = Object.assign(
        { key: workJwtKey },
        // required authentication middleware
        { guard: jwtAuthMw(true) },
        // optional authentication middleware
        { option: jwtAuthMw(false) },
        // basic authentication middleware,
        { basic: basicAuthMw() },
    );


    if (firstWorker) logger.ok("OK");


    // share auth-specific variables
    share({ auth });

}




/**
 * Global declaration merging.
 */
declare global {

    /**
     * Shared memory type augmentation.
     */
    interface Ctx {
        auth: {
            key: Uint8Array;
            guard: RequestHandler;
            option: RequestHandler;
            basic: RequestHandler;
        };
    }

    /**
     * Express' request interface augmentation.
     */
    namespace Express {
        interface Request {
            xauth: DecodedBearerToken & BearerToken;
            xbasic: string;
        }
    }

}
