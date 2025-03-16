import { EnvNotFoundError } from "extils";
import { appLogger } from "../utils/logger/index.js";
import('@dotenvx/dotenvx/config.js')


export const envConfig = {
    PORT: process.env.PORT || 3000,
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_DB_URL: process.env.MONGO_DB_URL!,
    FRONTEND_URL: process.env.FRONTEND_URL!
}

export function loadEnv() {
    for (let env in envConfig) {
        appLogger.info(envConfig[env as keyof typeof envConfig]);
        if (!envConfig[env as keyof typeof envConfig]) {
            appLogger.error(envConfig[env as keyof typeof envConfig]);
            
            throw new EnvNotFoundError(env, "expensum backend")
        }
    }
    
    appLogger.info("ENV's all set");
};