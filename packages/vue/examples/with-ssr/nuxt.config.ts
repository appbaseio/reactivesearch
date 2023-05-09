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
	nitro: {
		preset: 'vercel',
	},
});
