/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
	projectRoot: __dirname,
	watchFolders: [path.resolve(__dirname, '..'), path.resolve(__dirname, '../../')],

	resolver: {
		blacklistRE: blacklist([
			new RegExp(`^${escape(path.resolve(__dirname, '..', 'node_modules'))}\\/.*$`),
			new RegExp(
				`^${escape(
					path.resolve(__dirname, '../..'),
				)}\\/((?!maps-native).)*\\/node_modules\\/.*$`,
			),
			new RegExp(
				`^${escape(path.resolve(__dirname, '../../native/'))}\\/.*\\/node_modules\\/.*$`,
			),
		]),

		providesModuleNodeModules: [
			'@babel/runtime',
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
			'schedule',
			...peerDependencies,
		],
	},
};
