const path = require('path');
const escape = require('escape-string-regexp');
const blacklist = require('metro/src/blacklist');

module.exports = {
	getProjectRoots() {
		return [
			__dirname,
			path.resolve(__dirname, '..'),
			path.resolve(__dirname, '../../'),
		];
	},
	getProvidesModuleNodeModules() {
		return [
			'react-native',
			'react',
			'redux',
			'expo',
			'react-redux',
			'redux-thunk',
			'native-base',
			'appbase-js',
			'@babel/polyfill',
			'@ptomasroos/react-native-multi-slider',
			'react-native-calendars',
			'xdate',
			'prop-types',
			'hoist-non-react-statics',
			'@babel/polyfill',
		];
	},
	getBlacklistRE() {
		return blacklist([
			new RegExp(`^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../..'))}\\/((?!native).)*\\/node_modules\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../../maps-native'))}\\/.*\\/node_modules\\/.*$`),
		]);
	},
};
