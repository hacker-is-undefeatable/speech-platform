import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Optional: force port if 5173 conflicts
  server: {
    port: 5173,
  },
  // If entry file issues persist, force it (rarely needed)
  // build: {
  //   rollupOptions: {
  //     input: '/src/main.jsx',
  //   }
  // }
})