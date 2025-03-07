import winston from "winston";
import { envConfig } from "../../config/env.config.js";
import { devLogger } from "./developmentLogger.js";

export let logger: winston.Logger;

if (envConfig.NODE_ENV === "production") {
    logger = devLogger
} else {
    logger = devLogger
}