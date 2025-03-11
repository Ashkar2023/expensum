import { ObjectId } from "mongoose";

export interface ICategory {
    user_id: ObjectId,
    name: string,
    readonly?: boolean
}