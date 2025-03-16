import { ExpenseDonutChart } from "@/components/donut.chart";
import { motion } from "framer-motion";
import { useState } from "react";
import { DailyBarChart } from "@/components/daily-bar.chart";
import { BudgetCreator } from "@/components/budget.creator";
import { BudgetProgressBar } from "@/components/budget-progress-bar";
import { IBudget } from "@/types/entities/budget.interface";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.18, // Delay between each child animation
        },
    },
};

const common = {
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: .6 } },
};

export const Dashboard = () => {
    const [budget, setBudget] = useState<IBudget | null>(null);

    return (
        <div className="p-4 bg-secondary h-full">

            <motion.div
                className="grid grid-cols-[1fr_1fr_1fr] grid-rows-2 gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={{ ...common, hidden: { opacity: 0, y: -10 } }}
                    className="max-h-fit"
                >
                    <ExpenseDonutChart />
                </motion.div>

                <motion.div
                    variants={{ ...common, hidden: { opacity: 0, x: +10 } }}
                    className="col-span-2"
                >
                    <DailyBarChart />
                </motion.div>
                <motion.div
                    variants={{ ...common, hidden: { opacity: 0, y: +10 } }}
                >
                    <BudgetCreator budget={budget} setBudget={setBudget} />
                </motion.div>

                <motion.div variants={{ ...common, hidden: { opacity: 0, x: +10 } }}>
                    <BudgetProgressBar budget={budget} setBudget={setBudget} />
                </motion.div>
            </motion.div>

        </div>
    )
}
