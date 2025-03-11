import { NextFunction, Request } from "express";
import { signJWT } from "../../utils/token.utils.js";
import { compare, hash } from "bcryptjs";
import { envConfig } from "../../config/env.config.js";
import { BadRequestError, ConflictError, DatabaseOpError, ResponseCreator } from "extils";
import { appLogger } from "../../utils/logger/index.js";
import { Model } from "mongoose";
import { IUser } from "../../shared/types/entities/user.interface.js";
import { appEmitter, appEmitterEvents } from "../../events/index.js";
import { isDevMode } from "../../utils/env.utils.js";

const adjectives = ["Cool", "Swift", "Brave", "Smart", "Witty", "Fast", "Clever", "Bold"];
const nouns = ["Tiger", "Eagle", "Panda", "Wolf", "Cheetah", "Falcon", "Shark", "Hawk"];

export const generateRandomUsername = (): string => {
    const randomAdj = adjectives[Math.round(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000);

    return `${randomAdj}${randomNoun}${randomNumber}`;
};

export class UserController {

    constructor(
        private _UserModel: Model<IUser>,
    ) {
    }

    async signup(req: Request, next: NextFunction) {
        const { email, password } = req.body;

        const hashedPassword = await hash(password, 10);

        let userExists = await this._UserModel.findOne({ email });

        if (userExists) {
            throw new ConflictError("Try with another email");
        }

        let user;
        try {
            user = await this._UserModel.create({
                email,
                username: generateRandomUsername(),
                password: hashedPassword
            })
        } catch (error) {
            appLogger.error("user creation failed", email);
            throw new DatabaseOpError("user creation failed", 400);
        }

        appLogger.info("user created");
        appEmitter.emit(appEmitterEvents.userCreated, user)

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
            .setData({
                _id: user._id,
                email: user.email,
                username: user.username,
            })
            .setCookie("ajwt", accessToken, {
                httpOnly: true,
                ...(isDevMode() ? { secure: true } : {})
            })
            .setCookie("rjwt", refreshToken, {
                httpOnly: true
            })
            .get();
    }

    async login(req: Request, next: NextFunction) {
        const { email, password } = req.body;

        let user;
        try {
            user = await this._UserModel.findOne({ email }).lean();
        } catch (error) {
            appLogger.error("Database operation failed while finding user", error);
            throw new DatabaseOpError("Database operation failed", 500);
        }

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
            .setData({
                username: user.username,
                email: user.email,
                _id: user._id
            })
            .setCookie("ajwt", accessToken, {
                httpOnly: true,
                ...(isDevMode() ? { secure: true } : {}) // you can write this way to not include the prop
            })
            .setCookie("rjwt", refreshToken, {
                httpOnly: true,
                secure: !isDevMode()
            })
            .get();
    }

    async refreshToken(req: Request, next: NextFunction) {
        const user = await this._UserModel.findOne({ _id: req.user }).lean();

        const accessToken = await signJWT({
            payload: { sub: user?._id.toString() },
            secret: envConfig.TOKEN_SECRET,
            tokenType: "ACCESS"
        });

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Token refreshed")
            .setData({})
            .setCookie("ajwt", accessToken, {
                httpOnly: true,
                secure: !isDevMode()
            })
            .get();
    }

    async logout(req: Request, next: NextFunction) {

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("User logged out")
            .setData({})
            .setCookie("ajwt", "", {
                httpOnly: true,
                expires: new Date()
            })
            .setCookie("rjwt", "", {
                httpOnly: true,
                expires: new Date()
            })
            .get();
    }
}