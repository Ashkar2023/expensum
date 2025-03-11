import React, { useState } from "react";
import { createBudget } from "@/api/queries/budget.queries";
import { IBudget } from "@/types/entities/budget.interface";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const BudgetCreator: React.FC = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const currentYear = currentDate.getFullYear();

    const [amount, setAmount] = useState<number>(0);

    const { mutate: createBudgetMutation, isPending } = useMutation({
        mutationFn: async () => {
            const newBudget: IBudget = {
                user_id: "null",
                month: currentDate.getMonth() + 1,
                year: currentYear,
                amount,
            };
            return createBudget(newBudget);
        },
        onSuccess: () => {
            toast.success(`Budget for ${currentMonth} created successfully!`,{
                style: {
                    border: "0.1px solid var(--color-border)",
                    borderRadius: "0"
                }
            }
            );
            setAmount(0);
        },
        onError: (error) => {
            //@ts-ignore
            toast.error(error.response.data.message,{
                style: {
                    border: "0.1px solid var(--color-border)",
                    borderRadius: "0"
                }
            });
            console.error(error);
        },
    });

    return (
        <div className="p-4 flex flex-col items-center gap-4 bg-background border rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-sm font-semibold">Create Budget for {currentMonth}</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter budget amount"
                className="w-full p-2 border rounded-md"
            />
            <button
                onClick={() => createBudgetMutation()}
                disabled={isPending || amount <= 0}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
                {isPending ? "Creating..." : `Create Budget`}
            </button>
        </div>
    );
};