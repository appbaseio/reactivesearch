/* eslint-disable no-undef */
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	telemetry: false,
	plugins: [
		{ src: '~/plugins/reactivesearch-vue', mode: 'all' }
	],
	build: {
		transpile: [/^gmap-vue($|\/)/, /^@appbaseio\/reactivesearch-vue($|\/)/, '@appbaseio/vue-google-maps-community-fork'],
	},
	nitro: {
		preset: 'vercel'
	}
})
