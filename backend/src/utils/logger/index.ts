import winston from "winston";
import { devLogger } from "./developmentLogger.js";

export let appLogger: winston.Logger;

if (process.env.NODE_ENV === "production") {
    appLogger = devLogger
} else {
    appLogger = devLogger
}