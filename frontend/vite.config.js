import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // Accept connections from any network
    port: 5173,           // You can change this if needed
    strictPort: true,
  },
})
