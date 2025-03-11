
export enum paymentMethods {
    UPI = "UPI",
    DEBITCARD = "DEBIT_CARD",
    CASH = "CASH"
}

export interface IExpense {
    user_id: string,
    amount: number,
    category: string,
    date: Date,
    description?: string,
    payment_method: paymentMethods,
    _id?: string
}