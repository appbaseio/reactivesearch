import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import postCSS from 'rollup-plugin-postcss';
import vuePlugin from 'rollup-plugin-vue';
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
let input;

const inputChunks = {
	index: 'src/index.js',
	version: 'src/components/Version/index.js',
	install: 'src/install.js',
	ReactiveList: 'src/components/result/ReactiveList.jsx',
	ResultCard: 'src/components/result/ResultCard.jsx',
	ResultList: 'src/components/result/ResultList.jsx',
	ReactiveBase: 'src/components/ReactiveBase/index.jsx',
	SingleList: 'src/components/list/SingleList.jsx',
	MultiList: 'src/components/list/MultiList.jsx',
	SingleRange: 'src/components/range/SingleRange.jsx',
	MultiRange: 'src/components/range/MultiRange.jsx',
	RangeSlider: 'src/components/range/RangeSlider.jsx',
	DynamicRangeSlider: 'src/components/range/DynamicRangeSlider.jsx',
	ReactiveComponent: 'src/components/basic/ReactiveComponent.jsx',
	SelectedFilters: 'src/components/basic/SelectedFilters.jsx',
	SingleDropdownList: 'src/components/list/SingleDropdownList.jsx',
	MultiDropdownList: 'src/components/list/MultiDropdownList.jsx',
	ToggleButton: 'src/components/list/ToggleButton.jsx',
	StateProvider: 'src/components/basic/StateProvider.jsx',
	ReactiveGoogleMap: 'src/components/maps/ReactiveGoogleMap.jsx',
	initReactivesearch: 'src/server/index.js',
	RangeInput: 'src/components/range/RangeInput.jsx',
};

if (es) {
	output = {
		dir: 'dist/es',
		format: 'es',
	};
	input = inputChunks;
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
	input = 'src/index.js';
} else if (cjs) {
	output = {
		dir: 'dist/cjs',
		format: 'cjs',
	};
	input = inputChunks;
} else if (format) {
	throw new Error(`invalid format specified: "${format}".`);
} else {
	throw new Error('no format specified. --environment FORMAT:xxx');
}

export default {
	input,
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
		vuePlugin({
			preprocessStyles: true,
		}),
		postCSS(),
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
			],
			plugins: [
				['@vue/babel-plugin-jsx', { transformOn: true, mergeProps: true }],
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-syntax-import-meta',
				['@babel/plugin-proposal-private-methods', { loose: true }],
				['@babel/plugin-proposal-class-properties', { loose: true }],
				'@babel/plugin-proposal-json-strings',
			],
		}),
		umd
			? replace({
				'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'),
				"components['vue-slider-component'] = require('vue-slider-component');": `
					var s = document.createElement("script");
					s.setAttribute("src","https://cdn.jsdelivr.net/npm/vue-slider-component@3.2.15/dist/vue-slider-component.umd.min.js");
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
