import { NextFunction, Request, Response } from "express";
import { signJWT, verifyJWT, TokenType } from "../../utils/token.utils";
import { HydratedDocument, Model } from "mongoose";
import { IUser } from "../../shared/types/entities/user.interface";
import UserModel from "./user.model";
import { compare, hash } from "bcryptjs";
import { envConfig } from "../../config/env.config";
import { BadRequestError, ResponseCreator, TokenError } from "extils";
import { TokenErrorTypes } from "../../shared/types/token.types";

export class UserController {
    private _userDb: Model<IUser>;

    constructor() {
        this._userDb = UserModel;
    }

    async signup(req: Request, next: NextFunction) {
        const { email, password } = req.body;

        const user = new this._userDb({
            email,
            password: await hash(password, 10)
        })

        await user.save();

        const accessToken = await signJWT({
            payload: { sub: user.id },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "ACCESS"
        });

        const refreshToken = await signJWT({
            payload: { sub: user.id },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "REFRESH"
        });

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Account created")
            .setData({})
            .setCookie("ajwt", accessToken, {
                httpOnly: true
            })
            .setCookie("rjwt", refreshToken, {
                httpOnly: true
            })
            .get();
    }

    async login(req: Request, next: NextFunction) {
        const { email, password } = req.body;

        const user = await this._userDb.findOne({ email }).lean();

        if (!user) {
            throw new BadRequestError("Invalid credential", 404)
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError("Invalid credentials", 401)
        }

        const accessToken = await signJWT({
            payload: { sub: user._id.toString() },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "ACCESS"
        });

        const refreshToken = await signJWT({
            payload: { sub: user._id.toString() },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "REFRESH"
        });

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Login successful")
            .setData({})
            .setCookie("ajwt", accessToken, {
                httpOnly: true
            })
            .setCookie("rjwt", refreshToken, {
                httpOnly: true
            })
            .get();
    }

    async refreshToken(req: Request, next: NextFunction) {
        const { rjwt } = req.cookies;

        if (!rjwt) {
            throw new TokenError("Invalid refresh token", 404, TokenErrorTypes.invalid_refresh_token.toString())
        }

        const decoded = await verifyJWT({
            jwt: rjwt,
            secret: envConfig.TOKEN_SECRET
        });

        const accessToken = await signJWT({
            payload: { sub: decoded.payload.sub },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "ACCESS"
        });

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Token refreshed")
            .setData({})
            .setCookie("ajwt", accessToken, {
                httpOnly: true
            })
            .get();
    }
}