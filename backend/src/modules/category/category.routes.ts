import { Router } from "express";
import { createCallback } from "extils";
import { CategoryController } from "./category.controller.js";
import CategoryModel from "./category.model.js";
import { expenseModel } from "../expense/expense.model.js";

const categoryControllerInstance = new CategoryController(CategoryModel, expenseModel)

export const categoryRouter = Router()

categoryRouter.get('/', createCallback(categoryControllerInstance.getAllCategories.bind(categoryControllerInstance)))

categoryRouter.put('/', createCallback(categoryControllerInstance.createCategory.bind(categoryControllerInstance)))

categoryRouter.patch('/category_id', createCallback(categoryControllerInstance.editCategory.bind(categoryControllerInstance)))

categoryRouter.delete('/category_id', createCallback(categoryControllerInstance.deleteCategory.bind(categoryControllerInstance)))