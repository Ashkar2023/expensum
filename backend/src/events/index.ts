import EventEmitter from "node:events";
import { IUser } from "../shared/types/entities/user.interface.js";
import CategoryModel from "../modules/category/category.model.js";
import { ICategory } from "../shared/types/entities/category.interface.js";
import { AnyBulkWriteOperation, ObjectId } from "mongoose";
import { appLogger } from "../utils/logger/index.js";

export const appEmitter = new EventEmitter();

export enum appEmitterEvents {
    userCreated = "users:create"
}

const defaultCategories: Pick<ICategory, "name" | 'readonly'>[] = [
    {
        name: "Others",
        readonly: true,
    },
    {
        name: "Fuel",
    },
    {
        name: "Shopping",
    },
    {
        name: "Housing",
    },
    {
        name: "Taxes",
    },
    {
        name: "Food",
    },
    {
        name: "Health",
    },
    {
        name: "Entertainment",
    }
]


appEmitter.on(appEmitterEvents.userCreated, async (userData: IUser & { _id: ObjectId }) => {
    try {
        console.log(userData)
        const bulkOps: AnyBulkWriteOperation<ICategory>[] = defaultCategories.map(cat => ({
            insertOne: {
                document: {
                    name: cat.name,
                    user_id: userData._id,
                    readonly: cat.readonly
                }
            }
        }));

        const created = await CategoryModel.bulkWrite(bulkOps, {
            ordered: false
        })

        created.isOk() ?
            appLogger.info("category bulkWrite success", userData._id) :
            appLogger.error("category bulkWrite failed", userData._id);

    } catch (error) {
        console.log(error)
    }
})