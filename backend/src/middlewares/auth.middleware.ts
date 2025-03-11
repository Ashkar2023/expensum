import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/token.utils.js";
import { BadRequestError, TokenError } from "extils";
import { TokenErrorTypes } from "../shared/types/token.types.js";
import { envConfig } from "../config/env.config.js";
import { JOSEError } from "jose/errors";
import { appLogger } from "../utils/logger/index.js";
import { isValidObjectId } from "mongoose";


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.ajwt;

        if (!token) {
            return next(new TokenError("Access token missing", 401, TokenErrorTypes.invalid_access_token));
        }

        const decoded = await verifyJWT({
            jwt: token,
            secret: envConfig.TOKEN_SECRET
        });

        if (!isValidObjectId(decoded.payload.sub)) {
            throw new BadRequestError("Invalid user id")
        }

        req.user = decoded.payload.sub;
        next();
    } catch (error) {
        let err = error;

        if (error instanceof JOSEError) {
            err = new TokenError("Invalid access token", 401, TokenErrorTypes.invalid_access_token)
        }

        appLogger.error((error as Error).message)
        return next(err);
    }
};