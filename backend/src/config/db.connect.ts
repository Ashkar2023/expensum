import mongoose from "mongoose";
import { envConfig } from "./env.config.js";
import { appLogger } from "../utils/logger/index.js";

export const connectDb = async () => {
    try {
        
        mongoose.connection.on("disconnected",(err)=>{
            appLogger.error("MongoDB disconnected")
            console.error(err)
        })
        mongoose.connection.on("error",(err)=>{
            appLogger.error("MongoDB error")
            console.error(err)
        })
        
        mongoose.connection.on('connected', () => appLogger.info('MongoDB: connected'));
        mongoose.connection.on('open', () => appLogger.info('MongoDB: open'));
        mongoose.connection.on('reconnected', () => appLogger.warn('MongoDB: reconnected'));
        mongoose.connection.on('disconnecting', () => appLogger.warn('MongoDB: disconnecting'));
        mongoose.connection.on('close', () => appLogger.warn('MongoDB: close'));
        
        
        await mongoose.connect(envConfig.MONGO_DB_URL, {
            maxPoolSize: 5,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,       
        });

    } catch (error) {
        appLogger.error("MongoDB: Error connecting", error);
        process.exit(1);
    }
}