const { resolve } = require('path');
const pkg = require('./package');

module.exports = {
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
	 ** Plugins to load before mounting the App
	 */
	plugins: ['~/plugins/reactivesearch-vue'],
	build: {
		babel: {
			presets: [],
			plugins: ['@babel/plugin-syntax-dynamic-import'],
		},
	},
};
