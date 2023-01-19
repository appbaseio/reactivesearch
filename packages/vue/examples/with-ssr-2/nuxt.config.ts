// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	telemetry: false,
	vite:{
		optimizeDeps: {
			include: ['@appbaseio/reactivecore', '@appbaseio/reactivesearch-vue', 'fast-deep-equal'],
		},
		build: {
			commonjsOptions: {
				include: [/reactivecore/, /reactivesearch/, /node_modules/],
			},
		},
	}
})
