import { ExpensePieChart } from "@/components/pie-chart"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const Dashboard = () => {
    return (
        <div className="p-4 bg-secondary h-full">
            <SidebarTrigger />

            <ExpensePieChart />
        </div>
    )
}
