import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/token.utils.js";
import { TokenError } from "extils";
import { TokenErrorTypes } from "../shared/types/token.types.js";
import { envConfig } from "../config/env.config.js";
import { JOSEError } from "jose/errors";
import { appLogger } from "../utils/logger/index.js";


export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.rjwt;

        if (!token) {
            return next(new TokenError("refresh token not found", 401, TokenErrorTypes.invalid_refresh_token));
        }

        const decoded = await verifyJWT({
            jwt: token,
            secret: envConfig.TOKEN_SECRET
        });

        req.user = decoded.payload.sub;
        next();
    } catch (error) {
        if (!(error instanceof JOSEError)) {
            appLogger.error(error)
        }

        appLogger.error((error as Error).message)
        return next(new TokenError("session ended", 401, TokenErrorTypes.invalid_refresh_token));
    }
};