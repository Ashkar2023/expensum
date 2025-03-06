import { RouterProvider } from "react-router"
import { appRouter } from "./router/router"

function App() {

    return (
        <RouterProvider router={appRouter}/>
    )
}

export default App
