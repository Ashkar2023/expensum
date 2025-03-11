import { Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export const AuthLayout = () => {
    const location = useLocation(); // Track route changes

    return (
        <div className="h-dvh grid place-content-center p-8 md:p-0">
            <AnimatePresence mode="sync">
                <motion.div
                    key={location.pathname} // Ensures animations work properly on route change
                    initial={{ opacity: 0, y: -15,  }}
                    animate={{ opacity: 1, y: 0 , }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
