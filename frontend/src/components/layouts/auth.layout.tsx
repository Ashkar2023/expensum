import { Outlet } from 'react-router'

export const AuthLayout = () => {
    return (
        <div className='h-dvh grid place-content-center p-8 md:p-0'>
            <Outlet />
        </div>
    )
}
