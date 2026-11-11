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
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{
            name: 'vue-vendor',
            test: /node_modules[\\/]@?vue(use)?/,
            priority: 20,
          }, {
            name: 'font-vendor',
            test: /node_modules[\\/]@?fortawesome/,
            priority: 15
          }, {
            name: 'vendor',
            test: /node_modules/,
            priority: 10,
          }, {
            name: 'common',
            minShareCount: 2,
            minSize: 10000,
            priority: 5,
          },]
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
})
