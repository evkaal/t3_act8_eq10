import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // ¡Aquí está la pieza que evita que la librería de íconos colapse!
  optimizeDeps: {
    exclude: ['lucide-react']
  }
})