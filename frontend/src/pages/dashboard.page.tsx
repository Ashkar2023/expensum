import { MonthPicker } from "@/components/month-picker";
import { ExpenseDonutChart } from "@/components/donut.chart"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { useState } from "react";
import { DailyBarChart } from "@/components/daily-bar.chart";
import { BudgetCreator } from "@/components/budget.creator";
import { BudgetRadialChart } from "@/components/budget-radial.chart";

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
    const [month, setMonth] = useState<Date | undefined>(undefined)

    return (
        <div className="p-4 bg-secondary h-full">
            <SidebarTrigger />

            <motion.div
                className="grid grid-cols-[1fr_1fr_1fr] grid-rows-2 gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={{ ...common, hidden: { opacity: 0, y: -10 } }}>
                    <ExpenseDonutChart />
                </motion.div>

                <motion.div variants={{ ...common, hidden: { opacity: 0, x: +10 } }} className="col-span-2">
                    <DailyBarChart />
                </motion.div>
                <motion.div variants={{ ...common, hidden: { opacity: 0, y: +10 } }}>
                    <BudgetCreator />
                </motion.div>

                <motion.div variants={{ ...common, hidden: { opacity: 0, y: +10 } }}>
                    <BudgetRadialChart />
                </motion.div>
            </motion.div>

        </div>
    )
}
