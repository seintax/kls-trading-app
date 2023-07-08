import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            '/app': {
                target: 'http://localhost:5200',
                changeOrigin: true
            }
        }
    }
})
