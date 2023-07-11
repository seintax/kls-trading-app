import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/app': {
                // target: 'http://localhost:5200',
                target: 'https://kls-trading-app.vercel.app',
                changeOrigin: true
            }
        }
    }
})

// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd())
//     console.log(env.mode)
//     return {
//         plugins: [react()],
//         server: {
//             port: 5174,
//             proxy: {
//                 '/app': {
//                     target: env.mode === "production" ? 'https://kls-trading-app.vercel.app' : 'http://localhost:5200',
//                     changeOrigin: true
//                 }
//             }
//         }
//     }
// })