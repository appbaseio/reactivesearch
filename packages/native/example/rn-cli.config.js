const path = require('path');
const escape = require('escape-string-regexp');
const blacklist = require('metro-bundler/src/blacklist');

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
			'react-redux',
			'redux-thunk',
			'native-base',
			'appbase-js',
			'@ptomasroos/react-native-multi-slider',
			'react-native-calendars',
			'xdate',
			'prop-types',
			'hoist-non-react-statics',
		];
	},
	getBlacklistRE() {
		return blacklist([
			new RegExp(`^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../examples'))}\\/.*\\/node_modules\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../../playground', 'node_modules'))}\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../../reactivecore', 'node_modules'))}\\/.*$`),
			new RegExp(`^${escape(path.resolve(__dirname, '../../web', 'node_modules'))}\\/.*$`),
		]);
	},
};
