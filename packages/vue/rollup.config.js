import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import builtins from 'rollup-plugin-node-builtins';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const minify = process.env.MINIFY;
const format = process.env.FORMAT;
const es = format === 'es';
const umd = format === 'umd';
const cjs = format === 'cjs';

let output;

if (es) {
	output = {
		file: 'dist/@appbaseio/reactivesearch-vue.es.js',
		format: 'es',
	};
} else if (umd) {
	const globalsUMD = {
		vue: 'Vue',
	};
	if (minify) {
		output = {
			file: 'dist/@appbaseio/reactivesearch-vue.umd.min.js',
			format: 'umd',
			globals: globalsUMD,
		};
	} else {
		output = {
			file: 'dist/@appbaseio/reactivesearch-vue.umd.js',
			format: 'umd',
			globals: globalsUMD,
		};
	}
} else if (cjs) {
	output = {
		file: 'dist/@appbaseio/reactivesearch-vue.cjs.js',
		format: 'cjs',
	};
} else if (format) {
	throw new Error(`invalid format specified: "${format}".`);
} else {
	throw new Error('no format specified. --environment FORMAT:xxx');
}

export default {
	input: 'src/index.js',
	output: Object.assign(
		{
			name: umd ? 'ReactiveSearchVue' : '@appbaseio/reactivesearch-vue',
			exports: 'named',
		},
		output,
	),
	external: umd
		? Object.keys(pkg.peerDependencies || {})
		: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
	plugins: [
		json(),
		umd
			? resolve({
				mainFields: ['browser', 'module'],
				browser: true,
				preferBuiltins: false,
			  })
			: {},
		umd
			? commonjs({
				include: [
					'../../node_modules/**',
					'/node_modules/**',
					/node_modules\/cross-fetch/,
					/node_modules\/@appbaseio\/reactivecore/,
				],
				namedExports: {
					'../../node_modules/highlight-words-core/dist/index.js': ['findAll'],
				},
			  })
			: {},
		babel({
			...(!umd && { exclude: 'node_modules/**' }),
			babelrc: false,
			extensions: ['.js', '.jsx', '.ts'],
			presets: [
				[
					'@babel/preset-env',
					{
						loose: true,
						modules: false,
					},
				],
				'@vue/babel-preset-jsx',
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-syntax-import-meta',
				['@babel/plugin-proposal-class-properties', { loose: false }],
				'@babel/plugin-proposal-json-strings',
			],
		}),
		umd
			? replace({
				'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'),
				"components['vue-slider-component'] = require('vue-slider-component');": `
					var s = document.createElement("script");
					s.setAttribute("src","https://cdn.jsdelivr.net/npm/vue-slider-component@2.8.2/dist/index.js");
					s.onload = function(){
						var VueSlider = global['vue-slider-component'];
						components['vue-slider-component'] = VueSlider;
					}
					document.head.appendChild(s);
				`,
				delimiters: ['', ''],
			  })
			: null,
		umd ? globals() : {},
		umd ? builtins() : {},
		minify ? terser() : null,
	].filter(Boolean),
};
