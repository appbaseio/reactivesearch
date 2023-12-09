/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		include: [
			'@appbaseio/reactivecore',
			'@appbaseio/reactivesearch-vue',
			'fast-deep-equal',
			'@vue/babel-helper-vue-transform-on'
		],
	},
	plugins: [vue()],
	build: {
		rollupOptions: {
			input: 'src/main.js'
		},
		commonjsOptions: {
			include: [/reactivecore/, /reactivesearch/, /node_modules/],
		},
	}
})
