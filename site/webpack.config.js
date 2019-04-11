const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
	context: path.resolve(__dirname, 'src'),
	entry: {
		main: './index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		chunkFilename: '[name].bundle.js',
		publicPath: '/reactivesearch/dist/',
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
		],
	},
};

if (process.env.NODE_ENV === 'production') {
	config.plugins = [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new CopyWebpackPlugin([
			{ from: '../images', to: '../reactivesearch/images' },
			{ from: '../icons', to: '../reactivesearch/icons' },
		]),
	];
	config.optimization = {
		minimizer: [
			// we specify a custom UglifyJsPlugin here to get source maps in production
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				uglifyOptions: {
					compress: false,
					ecma: 6,
					mangle: true,
				},
				sourceMap: true,
			}),
		],
	};
	config.optimization.splitChunks = {
		name: 'common',
	};
}

module.exports = config;
