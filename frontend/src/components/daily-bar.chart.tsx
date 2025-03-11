import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { getAllExpenses } from "@/api/queries/expense.queries";
import { useMemo } from "react";
import { IExpense } from "@/types/entities/expense.interface";
import { api_v1_data } from "@/types/api-response.types";
import { AxiosError } from "axios";
import { format } from "date-fns";

export function DailyBarChart({ className, ...props }: React.ComponentProps<"div">) {
    const { data: expensesData } = useQuery<api_v1_data<IExpense[]>, AxiosError<api_v1_data>>({
        queryKey: ["expenses"],
        queryFn: getAllExpenses,
        retry: false,
    });

    const chartData = useMemo(() => {
        if (!expensesData?.body) return [];

        // Group expenses by date
        const dailyExpenseMap = expensesData.body.reduce((acc, expense: IExpense) => {
            const date = format(new Date(expense.date), "yyyy-MM-dd"); // Format date as YYYY-MM-DD
            acc[date] = (acc[date] || 0) + expense.amount;
            return acc;
        }, {} as Record<string, number>);

        // Convert object into an array
        return Object.entries(dailyExpenseMap).sort((a,b)=>a[1] - b[1]).map(([date, amount]) => ({
            date,
            amount,
        }));
    }, [expensesData]);

    const chartConfig = useMemo(() => {
        const config: ChartConfig = {
            amount: { label: "Amount" },
        };

        return config;
    }, []);

    return (
        <Card className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="items-center pb-0">
                <CardTitle>Daily Expense Overview</CardTitle>
                <CardDescription>Showing total expenses per day</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer className="aspect-auto h-[130px] w-full" config={chartConfig}>
                    <BarChart data={chartData} margin={{ left: 12, right: 12 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={24}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="amount"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                />
                            }
                        />
                        <Bar dataKey="amount" fill="var(--chart-1)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
