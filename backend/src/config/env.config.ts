import { EnvNotFoundError } from "extils";
import { appLogger } from "../utils/logger/index.js";
import { config } from '@dotenvx/dotenvx'

config();

export const envConfig = {
  PORT: process.env.PORT || "3000",
  TOKEN_SECRET: process.env.TOKEN_SECRET!,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_DB_URL: process.env.MONGO_DB_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!
} as const;

export function loadEnv() {
  const missingEnvs: string[] = [];

  for (const [key, value] of Object.entries(envConfig)) {
    if (!value) {
      missingEnvs.push(key);
    }
  }

  if (missingEnvs.length > 0) {
    appLogger.error(`❌ Missing required ENV variables: ${missingEnvs.join(", ")}`);
    throw new EnvNotFoundError(`Missing ENV(s): ${missingEnvs.join(", ")}`, "expensum backend");
  }

  appLogger.info("✅ All required ENV variables are set.");
}
