import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: [
      '@appbaseio/reactivecore',
      '@appbaseio/reactivesearch-vue',
      'fast-deep-equal',
    ],
  },
  build: {
    commonjsOptions: {
      include: [/reactivecore/, /reactivesearch/, /node_modules/],
    },
  },
})
