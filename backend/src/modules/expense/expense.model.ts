import { model, Schema } from "mongoose";
import { IExpense, paymentMethods } from "../../shared/types/entities/expense.interface.js";

const expenseSchema = new Schema<IExpense>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        payment_method: {
            type: String,
            enum: Object.values(paymentMethods),
            required: true
        },
        description: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

export const expenseModel = model<IExpense>("Expense", expenseSchema, "expenses");