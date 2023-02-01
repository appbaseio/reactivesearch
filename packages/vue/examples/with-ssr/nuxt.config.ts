export default defineNuxtConfig({
	telemetry: false,
	vite: {
		optimizeDeps: {
			include: [
				'@appbaseio/reactivecore',
				'@appbaseio/reactivesearch-vue',
				'vue-emotion',
				'fast-deep-equal',
			],
		},
		build: {
			commonjsOptions: {
				include: [/reactivecore/, /vue-emotion/, /reactivesearch/, /node_modules/],
			},
		},
	},
});
