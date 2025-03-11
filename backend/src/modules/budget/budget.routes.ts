import { Router } from "express";
import { createCallback } from "extils";
import { BudgetController } from "./budget.controller.js";
import { BudgetModel } from "./budget.model.js";

const budgetControllerInstance = new BudgetController(BudgetModel);

export const budgetRouter = Router();

budgetRouter.post('/', createCallback(budgetControllerInstance.createBudget.bind(budgetControllerInstance)));

budgetRouter.patch('/:budget_id', createCallback(budgetControllerInstance.editBudget.bind(budgetControllerInstance)));

budgetRouter.delete('/:budget_id', createCallback(budgetControllerInstance.deleteBudget.bind(budgetControllerInstance)));

budgetRouter.get('/current', createCallback(budgetControllerInstance.getCurrentMonthBudget.bind(budgetControllerInstance)));