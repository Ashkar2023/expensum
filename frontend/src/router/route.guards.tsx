import useUserStore from "@/stores/user.store";
import { FC, ReactNode } from "react";
import { Navigate } from "react-router";

export const ProtectedRoute: FC<{ children: ReactNode }> = ({ children }) => {
    const isLoggedIn = useUserStore(state => state.isLoggedIn);

    return isLoggedIn ? children : <Navigate to={"/auth"} replace />
}

export const PublicRoute: FC<{ children: ReactNode }> = ({ children }) => {
    const isLoggedIn = useUserStore(state => state.isLoggedIn);

    return isLoggedIn ? <Navigate to={"/"} replace /> : children;
}
