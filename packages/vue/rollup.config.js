import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
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
  if (minify) {
    output = {
      file: 'dist/@appbaseio/reactivesearch-vue.umd.min.js',
      format: 'umd',
    };
  } else {
    output = {
      file: 'dist/@appbaseio/reactivesearch-vue.umd.js',
      format: 'umd',
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
    },
    output,
  ),
  external: umd
    ? Object.keys(pkg.peerDependencies || {})
    : [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          'env',
          {
            loose: true,
            modules: false,
          },
        ],
        'stage-2',
      ],
      plugins: ['jsx-vue-functional', 'transform-vue-jsx', 'external-helpers'],
    }),
    umd
      ? resolve({
          jsnext: true,
          main: true,
          browser: true,
          preferBuiltins: true,
        })
      : {},
    umd
      ? commonjs({
          include: 'node_modules/**',
        })
      : {},
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'),
        })
      : null,
    minify ? terser() : null,
  ].filter(Boolean),
};
