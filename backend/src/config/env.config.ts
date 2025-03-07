import { EnvNotFoundError } from "extils";
import dotenv from "dotenv"

dotenv.configDotenv();

export const envConfig = {
    PORT: process.env.PORT || 3000,
    TOKEN_SECRET: process.env.TOKEN_SECRET!,
    NODE_ENV: process.env.NODE_ENV || "development"
}

    ;
(function () {
    for (let env in envConfig) {
        if (!envConfig[env as keyof typeof envConfig]) {
            // log to winston envConfig[env as keyof typeof envConfig]
            
            throw new EnvNotFoundError(env, "this")
        }

        // log env fine to winston
    }
})();