import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
})
