import "./config/env.config.js"
import express from "express";
import cors from "cors";
import { envConfig } from "./config/env.config.js";
import { logger } from "./utils/logger/index.js";
import { userRouter } from "./modules/user/user.routes.js";

const app = express();

app.use(cors({
    origin: ["http://localhost:5252"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
    maxAge: 600
}));

app.use(express.json());


app.use("/v1/users", userRouter)


app.listen(envConfig.PORT, () => {
    logger?.info(`Server is running on port ${envConfig.PORT}`);
});