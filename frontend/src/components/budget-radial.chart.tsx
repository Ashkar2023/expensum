"use client";

import { useEffect, useState } from "react";
import { PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, Label } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { getCurrentMonthBudget } from "@/api/queries/budget.queries";
import { toast } from "sonner";
import { getAllExpenses } from "@/api/queries/expense.queries";

const chartConfig: ChartConfig = {
    budget: {
        label: "Budget Used",
    },
};

export function BudgetRadialChart() {
    const [budget, setBudget] = useState<number>(0);
    const [spent, setSpent] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetData = await getCurrentMonthBudget();
                setBudget(budgetData.body.amount);

                const expensesData = await getAllExpenses();
                const currentMonth = new Date().getMonth();
                const totalSpent = expensesData.body
                    .filter(expense => new Date(expense.date).getMonth() === currentMonth)
                    .reduce((acc, expense) => acc + expense.amount, 0);
                setSpent(totalSpent);
            } catch (error) {
                console.error("Failed to fetch budget or expenses data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate budget usage percentage (capped at 100%)
    const percentageUsed = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

    // Alert Conditions
    useEffect(() => {
        const today = new Date();
        const dayOfMonth = today.getDate();

        if (percentageUsed > 90) {
            toast.warning(`⚠️ Warning: You have used ${percentageUsed.toFixed(1)}% of your budget!`);
        }

        if (percentageUsed >= 100 && dayOfMonth < 25) {
            toast.error(`🚨 Alert: Your budget has exceeded 100% before the 25th! Reduce spending.`);
        }
    }, [percentageUsed]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="flex flex-col max-h-[300px]">
            <CardHeader className="items-center pb-0">
                <CardTitle>Budget Usage</CardTitle>
                <CardDescription>Tracking your monthly expenses</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadialBarChart
                        data={[{ name: "Budget", value: percentageUsed, fill: "var(--chart-1)" }]}
                        startAngle={90}
                        endAngle={90 + (360 * percentageUsed) / 100} // Maps correctly
                        innerRadius={70}
                        outerRadius={120}
                        barSize={15}
                    >
                        <PolarGrid gridType="circle" radialLines={false} stroke="none" />
                        <RadialBar dataKey="value" background />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />

                        {/* Centered Label with Budget and Spent */}
                        <Label
                            position="center"
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
                                                // y={viewBox.cy - 10}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                ₹{spent.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 15}
                                                className="fill-muted-foreground text-sm"
                                            >
                                                Spent of ₹{budget.toLocaleString()}
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
