const path = require('path');
const webpack = require('webpack');
const Clean = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');
const Dashboard = require('webpack-dashboard/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTML = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OfflinePlugin = require('offline-plugin');

const root = __dirname;
const build = path.join(root, 'build');

module.exports = (env) => {
	const isProd = env && env.production;

	return {
		entry: {
			app: './src/index',
			vendor: './src/vendor',
		},
		output: {
			path: build,
			filename: '[name].[hash].js',
			publicPath: '/',
		},
		resolve: {
			extensions: ['.ts', '.tsx', '.js'],
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: ['awesome-typescript-loader'],
				},
				{
					test: /\.css$/,
					use: ExtractTextPlugin.extract({
						fallback: 'style-loader',
						use: [
							{
								loader: 'css-loader',
								options: {
									sourceMap: true,
									modules: false,
									importLoaders: true,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									plugins() {
										return [
											require('autoprefixer'), // eslint-disable-line
										];
									},
								},
							},
						],
					}),
				},
			],
		},
		plugins: [ /* prod and dev plugins */
			new Clean([build], { root }),
			new Copy([{ context: 'src/static/', from: '**/*.*' }]),
			new Copy([{ context: 'src/', from: 'web.config' }]),
			new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
			}),
			new HTML({ template: 'src/index.html', minify: { collapseWhitespace: isProd } }),
			new ExtractTextPlugin(isProd ? '[name].[hash].css' : '[name].css'),
			new ManifestPlugin({ fileName: 'asset-manifest.json' }),
		].concat(isProd
			? [ /* prod only plugins */
				new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
				new webpack.optimize.UglifyJsPlugin({
					output: {
						comments: 0,
					},
					compress: {
						unused: 1,
						warnings: 0,
						comparisons: 1,
						conditionals: 1,
						negate_iife: 0, // <- for `LazyParseWebpackPlugin()`
						dead_code: 1,
						if_return: 1,
						join_vars: 1,
						evaluate: 1,
					},
				}),
				new OfflinePlugin(),
			]
			: [ /* dev only plugins */
				new webpack.HotModuleReplacementPlugin(),
				new webpack.NamedModulesPlugin(),
				new Dashboard(),
			]),
		devtool: !isProd && 'eval',
		devServer: {
			contentBase: build,
			port: process.env.PORT || 3000,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: !isProd,
		},
	};
};
