import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import yaml from '@modyfi/vite-plugin-yaml'
import viteImagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), yaml(), viteImagemin({
    gifsicle: { optimizationLevel: 7 },
    mozjpeg: { quality: 80 },
    pngquant: { quality: [0.8, 0.9] },
    svgo: {
      plugins: [
        { name: 'removeViewBox' },
        { name: 'removeEmptyAttrs', active: false }
      ]
    }
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100
    },
    cors: true,
    hmr: {
      overlay: true,
      clientPort: 443,
      protocol: 'wss',
      timeout: 30000
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:4000')
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
    exclude: ['vue-demi']
  },
  cacheDir: '.vite',
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@headlessui/vue', 'lucide-vue-next'],
          'utils': ['./src/utils']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
