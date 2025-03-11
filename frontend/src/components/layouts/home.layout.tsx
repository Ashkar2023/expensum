import { Outlet } from 'react-router'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'

export const HomeLayout = () => {
    return (
        <SidebarProvider className=''>
            <AppSidebar />

            <main className='w-full'>
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
