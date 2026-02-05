import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Optional: force port if 5173 conflicts
    server: {
      port: 5173,
    },
    define: {
      'process.env': env
    }
  }
})