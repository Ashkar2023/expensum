import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import ClosePlugin from "./closePlugin"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), ClosePlugin() as any],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    server: {
        port: 5252
    }
})
