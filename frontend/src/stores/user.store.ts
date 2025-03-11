import { IUser } from "@/types/entities/user.interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type userState = Partial<IUser>
type loggedInState = {
    isLoggedIn: boolean
};
type userReducers = {
    setUser: (userState: userState) => void
    clearUser: () => void
}

type userStore = userState & userReducers & loggedInState;

const initialUser = {
    _id: undefined,
    email: undefined,
    password: undefined,
    username: undefined,
}

const useUserStore = create<userStore>()(
    persist(
        (set) => ({
            ...initialUser,
            isLoggedIn: false,
            setUser: (user) => set({
                ...user,
                isLoggedIn: true
            }),
            clearUser: () => set({
                ...initialUser,
                isLoggedIn: false
            })
        }),
        {
            name: "user-state",
        }
    )
)

export default useUserStore