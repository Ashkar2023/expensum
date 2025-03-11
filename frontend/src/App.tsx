import { RouterProvider } from "react-router"
import { appRouter } from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={appRouter} />
            <Toaster position="top-center" richColors theme="dark"/>
        </QueryClientProvider>
    )
}

export default App
