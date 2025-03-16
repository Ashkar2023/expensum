import React, { useEffect, useState } from "react";
import { createBudget, editBudget } from "@/api/queries/budget.queries";
import { IBudget } from "@/types/entities/budget.interface";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api_v1_data } from "@/types/api-response.types";
import { AxiosError } from "axios";
import useUserStore from "@/stores/user.store";
import { ToastStyle } from "@/lib/toast.styles";

type Props = {
    budget: IBudget | null,
    setBudget: (budget: IBudget | null) => void
}

export const BudgetCreator: React.FC<Props> = ({ budget, setBudget }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", { month: "long" });
    const currentYear = currentDate.getFullYear();

    const [amount, setAmount] = useState<number | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const userId = useUserStore(state => state._id);

    useEffect(() => {
        budget && setAmount(budget?.amount)
        budget && setEditMode(true)
    }, [budget])

    const { mutate: createBudgetMutation, isPending: isCreating } = useMutation<api_v1_data<IBudget>, AxiosError<api_v1_data>, IBudget>({
        mutationFn: createBudget,
        onSuccess(data, avrs, cont) {
            console.log(cont)
            toast.success(`Budget for ${currentMonth} created successfully!`, {
                style: {
                    ...ToastStyle
                }
            });
            setAmount(0);
            setBudget(data.body);
            setEditMode(true);
        },
        onError: (error) => {
            toast.error(error.response?.data.message, {
                style: {
                    ...ToastStyle
                }
            });
            console.error(error);
        }
    });

    const { mutate: updateBudgetMutation, isPending: isUpdating } = useMutation({
        mutationFn: editBudget,
        onSuccess(data) {
            toast.success(`Budget for ${currentMonth} updated successfully!`, {
                style: {
                    ...ToastStyle
                }
            });
            setBudget(data.body);
        },
        onError: (error) => {
            //@ts-ignore
            toast.error(error.response.data.message, {
                style: {
                    ...ToastStyle
                }
            });
            console.error(error);
        },
    });

    const handleSubmit = () => {

        if (!amount) {
            return toast.error("amount should be > 0", {
                style: {
                    ...ToastStyle
                }
            });
        }

        if (editMode) {
            updateBudgetMutation({
                amount: amount,
                budget_id: budget?._id!
            });
        } else {

            createBudgetMutation({
                amount,
                month: currentDate.getMonth() + 1,
                user_id: userId!,
                year: currentYear,
                _id: budget?._id
            });
        }
    };

    return (
        <div className="p-4 flex flex-col items-center gap-4 bg-background border rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-sm font-semibold">{editMode ? `Edit Budget for ${currentMonth}` : `Create Budget for ${currentMonth}`}</h2>
            <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter budget amount"
                className="w-full p-2 border rounded-md"
            />
            <button
                onClick={handleSubmit}
                disabled={isCreating || isUpdating}
                className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
                {isCreating || isUpdating ? (editMode ? "Updating..." : "Creating...") : (editMode ? "Update Budget" : "Create Budget")}
            </button>
        </div>
    );
};