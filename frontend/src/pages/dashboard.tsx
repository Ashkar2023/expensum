import { ExpensePieChart } from "@/components/pie-chart"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const Dashboard = () => {
    return (
        <div className="p-4 bg-secondary h-full">
            <SidebarTrigger />

            <div className="grid grid-cols-[1fr_1fr_1fr] grid-rows-2 gap-1">
                <ExpensePieChart />
                <ExpensePieChart className="col-span-2"/>
                <ExpensePieChart className="col-span-2"/>
                <ExpensePieChart />
            </div>
        </div>
    )
}
