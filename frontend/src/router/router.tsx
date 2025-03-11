import { AuthLayout } from "@/components/layouts/auth.layout";
import { HomeLayout } from "@/components/layouts/home.layout";
import { LoginForm } from "@/components/login-form";
import { OtpForm } from "@/components/otp-form";
import { Dashboard } from "@/pages/dashboard.page";
import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute, PublicRoute } from "./route.guards";
import { Category } from "@/pages/category.page";
import { Expense } from "@/pages/expense.page";

export const appRouter = createBrowserRouter([
    {
        path: "/auth",
        element: (
            <PublicRoute>
                <AuthLayout />
            </PublicRoute>
        ),
        children: [
            {
                index: true,
                element: <LoginForm />
            },
            {
                path: "verify",
                element: <OtpForm />
            }
        ]
    },
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <HomeLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Dashboard />
            },
            {
                path: "/category",
                element: <Category />
            },
            {
                path: "/expense",
                element: <Expense />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={"/auth"} replace />
    }
])