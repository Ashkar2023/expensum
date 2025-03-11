import { envConfig } from "../config/env.config.js"

export const isDevMode = (): boolean => {
    return envConfig.NODE_ENV === "production" ? false : true;
}