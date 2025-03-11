import { Request, NextFunction } from "express";
import { Model } from "mongoose";
import { IBudget } from "../../shared/types/entities/budget.interface.js";
import { BadRequestError, DatabaseOpError, ResponseCreator } from "extils";
import { appLogger } from "../../utils/logger/index.js";


export class BudgetController {
    constructor(
        private _BudgetModel: Model<IBudget>
    ) { }

    async createBudget(req: Request, next: NextFunction) {
        const { amount } = req.body;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (!amount) {
            throw new BadRequestError("Budget amount is required", 400);
        }

        try {
            const existingBudget = await this._BudgetModel.findOne({
                user_id: req.user,
                month: currentMonth,
                year: currentYear
            });
            console.log(existingBudget)
            if (existingBudget) {
                throw new BadRequestError("Budget for the current month already exists", 400);
            }

            const budget = await this._BudgetModel.create({
                amount,
                user_id: req.user,
                month: currentMonth,
                year: currentYear
            });

            const response = new ResponseCreator();
            return response
                .setStatusCode(201)
                .setMessage("Budget created successfully")
                .setData(budget)
                .get();

        } catch (error) {
            appLogger.error("Error creating budget", error);
            if(error instanceof BadRequestError){
                throw error
            }else{
                throw new DatabaseOpError("Error creating budget", 500);
            }
        }
    }

    async editBudget(req: Request, next: NextFunction) {
        const { budget_id } = req.params;
        const { amount } = req.body;

        if (!amount) {
            throw new BadRequestError("Budget amount is required", 400);
        }

        try {
            const budget = await this._BudgetModel.findOneAndUpdate(
                { _id: budget_id, user_id: req.user },
                { $set: { amount } },
                { new: true }
            );

            if (!budget) {
                throw new BadRequestError("Budget not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Budget updated successfully")
                .setData(budget)
                .get();

        } catch (error) {
            appLogger.error("Error updating budget", error);
            throw new DatabaseOpError("Error updating budget", 500);
        }
    }

    async deleteBudget(req: Request, next: NextFunction) {
        const { budget_id } = req.params;

        try {
            const budget = await this._BudgetModel.findOneAndDelete({ _id: budget_id, user_id: req.user });

            if (!budget) {
                throw new BadRequestError("Budget not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Budget deleted successfully")
                .setData(budget)
                .get();
        } catch (error) {
            appLogger.error("Error deleting budget", error);
            throw new DatabaseOpError("Error deleting budget", 500);
        }
    }

    async getCurrentMonthBudget(req: Request, next: NextFunction) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        try {
            const budget = await this._BudgetModel.findOne({
                user_id: req.user,
                month: currentMonth,
                year: currentYear
            }).lean();

            if (!budget) {
                throw new BadRequestError("Budget for the current month not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Current month budget fetched")
                .setData(budget)
                .get();
        } catch (error) {
            appLogger.error("Error fetching current month budget", error);
            throw new DatabaseOpError("Error fetching current month budget", 500);
        }
    }
}