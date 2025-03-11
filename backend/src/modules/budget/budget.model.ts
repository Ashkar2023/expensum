import { model, Schema } from "mongoose";
import { IBudget } from "../../shared/types/entities/budget.interface.js";

const budgetSchema = new Schema<IBudget>({
    user_id: { type: String, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    amount: { type: Number, required: true },
}, {
    timestamps: true,
});

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const BudgetModel = model<IBudget>('Budget', budgetSchema, "budgets");