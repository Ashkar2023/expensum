import { Request, NextFunction } from "express";
import { Model } from "mongoose";
import { ICategory } from "../../shared/types/entities/category.interface.js";
import { IExpense } from "../../shared/types/entities/expense.interface.js";
import { BadRequestError, DatabaseOpError, ResponseCreator } from "extils";
import { appLogger } from "../../utils/logger/index.js";

export class CategoryController {
    constructor(
        private _CategoryModel: Model<ICategory>,
        private _ExpenseModel: Model<IExpense>,
        // private _UserModel: Model<IUser>
    ) { }

    async getAllCategories(req: Request, next: NextFunction) {
        const categories = await this._CategoryModel.find({ user_id: req.user }).lean();

        const response = new ResponseCreator();
        return response
            .setStatusCode(200)
            .setMessage("Categories fetched")
            .setData(categories)
            .get();

    }

    async createCategory(req: Request, next: NextFunction) {
        const { name } = req.body;

        if (!name) {
            throw new BadRequestError("Category name is required", 400);
        }

        try {
            const category = await this._CategoryModel.insertOne({
                name,
                user_id: req.user
            });

            const response = new ResponseCreator();
            return response
                .setStatusCode(201)
                .setMessage("Category created successfully")
                .setData(category)
                .get();

        } catch (error) {
            appLogger.error("Error creating category", error);
            throw new DatabaseOpError("Error creating category", 500);
        }
    }

    async editCategory(req: Request, next: NextFunction) {
        const { category_id } = req.params;
        const { name } = req.body;

        if (!name) {
            throw new BadRequestError("Category name is required", 400);
        }

        try {
            const category = await this._CategoryModel.findOneAndUpdate(
                { _id: category_id, user_id: req.user },
                { $set: { name } },
                { new: true }
            );

            if (!category) {
                throw new BadRequestError("Category not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Category updated successfully")
                .setData(category)
                .get();

        } catch (error) {
            appLogger.error("Error updating category", error);
            throw new DatabaseOpError("Error updating category", 500);
        }
    }

    async deleteCategory(req: Request, next: NextFunction) {
        const { category_id } = req.params;

        try {
            const expenses = await this._ExpenseModel.find({ category_id: category_id, user_id: req.user });

            if (expenses.length > 0) {
                throw new BadRequestError("Cannot delete category with existing expenses", 400);
            }

            const category = await this._CategoryModel.findOneAndDelete({ _id: category_id, user_id: req.user, readonly: false });

            if (!category) {
                throw new BadRequestError("Category not found", 404);
            }

            const response = new ResponseCreator();
            return response
                .setStatusCode(200)
                .setMessage("Category deleted successfully")
                .setData(category)
                .get();
        } catch (error) {
            appLogger.error("Error deleting category", error);
            throw new DatabaseOpError("Error deleting category", 500);
        }
    }
}