import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import ClosePlugin from "./closePlugin"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), ClosePlugin()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    build:{
        outDir:"dist"
    },
    server: {
        port: 5252
    }
})
