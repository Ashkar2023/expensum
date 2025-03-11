import { Router } from "express";
import { UserController } from "../user.controller.js";
import { createCallback } from "extils";
import { verifyRefreshToken } from "../../../middlewares/refresh-token.middleware.js";
import { userModel } from "../user.model.js";

const userControllerInstance = new UserController(userModel);

export const userAuthRouter = Router()

userAuthRouter.put("/signup", createCallback(userControllerInstance.signup.bind(userControllerInstance)))

userAuthRouter.post("/login", createCallback(userControllerInstance.login.bind(userControllerInstance)))

userAuthRouter.post("/logout", createCallback(userControllerInstance.logout.bind(userControllerInstance)))

userAuthRouter.post("/r", verifyRefreshToken, createCallback(userControllerInstance.refreshToken.bind(userControllerInstance)))