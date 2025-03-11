import { ObjectId } from "mongoose";

export enum paymentMethods {
    UPI="UPI",
    DEBIT_CARD="DEBIT_CARD",
    CASH="CASH"
}

export interface IExpense {
    user_id: ObjectId,
    amount: number,
    category: ObjectId,
    date: Date,
    description?: string,
    payment_method: paymentMethods,
}