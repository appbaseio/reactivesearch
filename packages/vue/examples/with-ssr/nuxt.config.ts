export default defineNuxtConfig({
	telemetry: false,
	build: {
		transpile: ['@appbaseio/reactivesearch-vue'],
	},
	css: ['@/assets/css/airbnb.css'],
	modules: ['@nuxtjs/emotion'],
	webpack: {
		terser: false,
	},
	vite: {
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
	},
	nitro:{
		preset: 'vercel'
	}
});
