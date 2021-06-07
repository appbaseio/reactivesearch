const { resolve } = require('path');
const pkg = require('./package');

export default {
	modulesDir: resolve(__dirname, '../../../../node_modules/'),

	/*
	 ** Headers of the page
	 */
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: pkg.description },
		],
		link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
	},

	/*
	 ** Customize the progress-bar color
	 */
	loading: { color: '#fff' },

	/*
	 ** Global CSS
	 */
	css: [],

	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: ['~/plugins/reactivesearch-vue'],

	/*
	 ** Nuxt.js modules
	 */
	modules: [],

	/*
	 ** Build configuration
	 */
	build: {
		transpile: [/^gmap-vue($|\/)/, /^@appbaseio\/reactivesearch-vue($|\/)/],
		babel: {
			presets: [],
			plugins: ['@babel/plugin-syntax-dynamic-import'],
		},
	},
};
