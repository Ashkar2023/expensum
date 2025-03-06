import { AuthLayout } from "@/components/layouts/auth.layout";
import { HomeLayout } from "@/components/layouts/home.layout";
import { LoginForm } from "@/components/login-form";
import { Dashboard } from "@/pages/dashboard";
import { createBrowserRouter, Navigate } from "react-router";

export const appRouter = createBrowserRouter([
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <LoginForm />
            }
        ]
    },
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            {
                index:true,
                element: <Dashboard/>
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={"/auth"} replace />
    }
])