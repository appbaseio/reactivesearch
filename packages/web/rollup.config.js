import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const version = pkg.version;

export default {
	input: './src/index.js',
	output: {
		file: 'umd/reactivesearch.js',
		format: 'umd',
		name: 'Reactivesearch',
		sourcemap: false,
	},
	// external: Object.keys(pkg.peerDependencies || {}),
	plugins: [
		commonjs({
			include: ['node_modules/**', '../reactivecore/**'],
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify('production'),
			'process.env.VERSION': JSON.stringify(version),
		}),
		resolve({
			jsnext: true,
			main: true,
			preferBuiltins: false,
			browser: true,
		}),
		babel({
			exclude: 'node_modules/**',
			babelrc: false,
			presets: [['env', { loose: true, modules: false }], 'react'],
			plugins: [
				'emotion',
				'transform-class-properties',
				'transform-object-rest-spread',
				'external-helpers',
			],
		}),
		terser(),
	],
};
