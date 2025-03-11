import { Label, Pie, PieChart } from "recharts"
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardDescription, CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { fetchInfiniteExpenses, getAllExpenses } from "@/api/queries/expense.queries";
import { useMemo } from "react";
import { IExpense } from "@/types/entities/expense.interface";
import { api_v1_data } from "@/types/api-response.types";
import { AxiosError } from "axios";

interface ExpenseChartData {
    category: string;
    amount: number;
    percentage: number;
    fill: string;
}

const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
] as const;

export function ExpenseDonutChart({ className, ...props }: React.ComponentProps<"div">) {
    const { data: expensesData } = useQuery<api_v1_data<IExpense[]>, AxiosError<api_v1_data>>({
        queryKey: ["expenses"],
        queryFn: getAllExpenses,
        retry: false,
    });

    const chartData = useMemo(() => {
        if (!expensesData?.body) return [];

        // Group expenses by category
        const categoryMap = expensesData.body.reduce((acc, expense: IExpense) => {
            const categoryId = expense.category;
            if (!acc[categoryId]) {
                acc[categoryId] = {
                    amount: 0,
                    category: expense.category, // Ensure this matches actual response
                };
            }
            acc[categoryId].amount += expense.amount;
            return acc;
        }, {} as Record<string, { amount: number; category: string }>);

        // Calculate total amount
        const totalAmount = Object.values(categoryMap).reduce(
            (sum, item) => sum + item.amount, 0
        );

        // Convert to chart data with percentages
        return Object.entries(categoryMap).sort((a, b) => b[1].amount - a[1].amount).map(([id, { amount, category }], index) => ({
            category,
            amount,
            percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0, // Avoid division by zero
            fill: chartColors[index],
        }));
    }, [expensesData]);


    const chartConfig = useMemo(() => {
        const config: ChartConfig = {
            amount: {
                label: "Amount",
            },
        };

        chartData.forEach((data) => {
            config[data.category] = {
                label: data.category,
                color: data.fill,
            };
        });

        return config;
    }, [chartData]);

    return (
        <Card className={cn("flex flex-col", className)} {...props}>
            <CardHeader className="items-center pb-0">
                <CardTitle>Budget breakdown</CardTitle>
                <CardDescription>January 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    className="mx-auto aspect-square max-h-[180px]"
                    config={chartConfig}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="category"
                            innerRadius={45}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-lg font-bold"
                                                >
                                                    {chartData.reduce((prev, curr) => (prev + curr.amount), 0)}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Amount
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <div className="mt-4">
                <div className="flex flex-wrap gap-4">
                    {chartData.map((data, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: data.fill }}
                            />
                            <span className="text-sm">
                                {data.category} ({data.percentage.toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div> */}
        </Card>
    );
}
