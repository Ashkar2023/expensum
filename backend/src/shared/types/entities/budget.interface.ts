import { ObjectId } from "mongoose";

export interface IBudget {
    user_id: ObjectId;
    month: number;
    year: number;
    amount: number;
}