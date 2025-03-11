import { Request, NextFunction } from "express";
import { Model } from "mongoose";
import { IExpense, paymentMethods } from "../../shared/types/entities/expense.interface.js";
import { BadRequestError, DatabaseOpError, ResponseCreator } from "extils";
import { appLogger } from "../../utils/logger/index.js";

export class ExpenseController {
    constructor(
        private _ExpenseModel: Model<IExpense>
    ) { }

    async getAllExpenses(req: Request, next: NextFunction) {
        const { category } = req.query;
        // const { page = "1", limit = "10", category } = req.query;
        // const skip = (+page - 1) * +limit;

        // validation

        const query: any = { user_id: req.user };

        category ? query.category = category : null;

        try {
            const expenses = await this._ExpenseModel.find(query)
                .sort({ date: -1 })
                // .skip(skip)
                // .limit(+limit)
                .lean();

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Expenses fetched")
                .setData(expenses)
                .get();
        } catch (error) {
            appLogger.error("Error fetching expenses", error);
            throw new DatabaseOpError("Error fetching expenses", 500);
        }
    }

    async createExpense(req: Request, next: NextFunction) {
        const { amount, category, payment_method, date, description } = req.body;

        if (
            !amount ||
            !category ||
            !date ||
            !(payment_method in paymentMethods)
        ) {
            throw new BadRequestError("fields required", 400);
        }

        try {
            const expense = await this._ExpenseModel.create({
                amount,
                category,
                user_id: req.user,
                payment_method,
                date,
                description
            });

            appLogger.info("expense recorded for user_id :" + req.user)

            const response = new ResponseCreator();
            return response
                .setStatusCode(201)
                .setMessage("Expense created successfully")
                .setData(expense)
                .get();
        } catch (error) {
            appLogger.error("Error creating expense", error);
            throw new DatabaseOpError("Error creating expense", 500);
        }
    }

    async deleteExpense(req: Request, next: NextFunction) {
        const { expense_id } = req.params;

        try {
            const expense = await this._ExpenseModel.findOneAndDelete({ _id: expense_id, user_id: req.user });

            if (!expense) {
                throw new BadRequestError("Expense not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Expense deleted successfully")
                .setData(expense)
                .get();
        } catch (error) {
            appLogger.error("Error deleting expense", error);
            throw new DatabaseOpError("Error deleting expense", 500);
        }
    }
}