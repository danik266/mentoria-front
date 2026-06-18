import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// envPrefix включает REACT_APP_, чтобы переменная
// REACT_APP_ANTHROPIC_API_KEY была доступна через import.meta.env
export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: {
    port: 5173,
    strictPort: true,
  },
})
