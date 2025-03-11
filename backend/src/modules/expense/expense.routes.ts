import { Router } from "express";
import { createCallback } from "extils";
import { ExpenseController } from "./expense.controller.js";
import { expenseModel } from "./expense.model.js";

const expenseControllerInstance = new ExpenseController(expenseModel);

export const expenseRoutes = Router();

expenseRoutes.get("/", createCallback(expenseControllerInstance.getAllExpenses.bind(expenseControllerInstance)))

expenseRoutes.put("/", createCallback(expenseControllerInstance.createExpense.bind(expenseControllerInstance)))

expenseRoutes.delete("/:expense_id", createCallback(expenseControllerInstance.deleteExpense.bind(expenseControllerInstance)))