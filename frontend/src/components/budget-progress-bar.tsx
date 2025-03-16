import { AlertTriangle, Skull } from "lucide-react";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { getCurrentMonthBudget } from "@/api/queries/budget.queries";
import { getAllExpenses } from "@/api/queries/expense.queries";
import { IBudget } from "@/types/entities/budget.interface";
import { cn } from "@/lib/utils";

type Props = {
    budget: IBudget | null,
    setBudget: (budget: IBudget) => void
}

const chartConfig: ChartConfig = {
    budget: {
        label: "Budget Used",
        color: "hsl(var(--chart-1))",
    },
};

export function BudgetProgressBar({ budget, setBudget }: Props) {
    const [spent, setSpent] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"warning" | "error" | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetData = await getCurrentMonthBudget();
                setBudget(budgetData.body);

                const expensesData = await getAllExpenses();
                const currentMonth = new Date().getMonth();

                const totalSpent = expensesData.body
                    .filter((expense) => new Date(expense.date).getMonth() === currentMonth)
                    .reduce((acc, expense) => acc + expense.amount, 0);

                setSpent(totalSpent);
            } catch (error) {
                console.error("Failed to fetch budget or expenses data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setBudget]);

    const percentageUsed = budget ? Math.min((spent / budget.amount) * 100, 100) : 0;

    useEffect(() => {
        const today = new Date();
        const dayOfMonth = today.getDate();

        if (percentageUsed > 90 && percentageUsed < 100 && dayOfMonth < 25) {
            setAlertType("warning");
            setAlertMessage(`You have used ${percentageUsed.toFixed(1)}% of your budget.`);
        } else if (percentageUsed >= 100) {
            setAlertType("error");
            setAlertMessage(`Your budget has exceeded 100% before the 25th! Reduce spending.`);
        } else {
            setAlertType(null);
            setAlertMessage(null);
        }
    }, [percentageUsed]);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Budget Usage</CardTitle>
                <CardDescription>Tracking your monthly expenses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="relative w-full h-5 bg-gray-200">
                    <div
                        className="relative h-full bg-green-600"
                        style={{ width: `${percentageUsed}%` }}
                    />
                    {/* <div className="absolute -top-3 left-0 flex justify-center items-center pointer-events-none">
                        <Play className="text-white" style={{ transform: `translateX(${percentageUsed}%) rotate(90deg)` }} size={10} />
                    </div> */}
                </div>
                <div className="w-full h-8">
                    <div className="flex justify-end min-w-fit"
                        style={{ width: `${percentageUsed}%` }}
                    >
                        <div className="">
                            <span className={cn("text-xl", percentageUsed < 90 ? "text-primary-foreground" : percentageUsed < 100 ? "text-yellow-500" : "text-red-600")}>
                                ₹{spent.toLocaleString()}</span>
                            <span className="text-secondary">/₹{budget?.amount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {alertMessage && (
                    <CardFooter className={cn("flex items-center gap-2 text-xs", alertType === "error" ? "text-red-600" : "text-yellow-500")}>
                        {alertType === "error" ? <Skull className="size-10" /> : <AlertTriangle className="h-5 w-5" />}
                        <span>{alertMessage}</span>
                    </CardFooter>
                )}
            </CardFooter>
        </Card>
    );
}
