import { CoinsIcon, LayoutDashboard, LucideIcon, ReceiptIndianRupee, SettingsIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { useLocation } from "react-router"

const applicationItems: { title: string, url: string, icon: LucideIcon }[] = [
    {
        title: "dashboard",
        icon: LayoutDashboard,
        url: "/"
    },
    {
        title:"expenses",
        icon: CoinsIcon,
        url:"/expense"
    },
    {
        title: "settings",
        icon: SettingsIcon,
        url: "/settings"
    }
]

export const AppSidebar = () => {
    const { pathname } = useLocation();
    console.log(pathname)
    return (
        <Sidebar>
            <SidebarHeader className="flex gap-1 flex-row items-center py-4">
                <ReceiptIndianRupee size={"3rem"} className="text-brand" />
                <h1 className="text-2xl font-extrabold">Expensum</h1>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                applicationItems.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={item.url === pathname}>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="flex justify-center p-4">
                <Button size="sm" className="font-normal bg-red-800">Logout</Button>
            </SidebarFooter>
        </Sidebar>
    )
}
