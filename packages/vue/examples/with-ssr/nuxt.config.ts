// eslint-disable-next-line no-undef
export default defineNuxtConfig({
	build: {
		transpile: ['@appbaseio/reactivesearch-vue'],
	},
	telemetry: false,
	css: ['@/assets/css/airbnb.css'],
	modules: ['@nuxtjs/emotion'],
	webpack: {
		terser: false,
	},
	nitro: {
		preset: 'vercel',
	},
	vite: {
		optimizeDeps: {
			include: [
				'@vue/babel-helper-vue-transform-on',
				'url-parser-lite',
				'cross-fetch',
				'querystring',
				'highlight-words-core',
				'ngeohash',
			],
		},
	},
});
