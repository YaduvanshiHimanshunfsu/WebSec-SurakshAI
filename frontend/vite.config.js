import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // During development, proxy API calls to Flask backend
    proxy: {
      '/api': 'http://127.0.0.1:5000',
      '/passive': 'http://127.0.0.1:5000',
      '/active': 'http://127.0.0.1:5000',
      '/reports': 'http://127.0.0.1:5000',
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
