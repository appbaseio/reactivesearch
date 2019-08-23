const path = require('path');

module.exports = {
	mode: 'development',
	context: path.resolve(__dirname, 'src'),
	entry: {
		main: './index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.js',
		publicPath: 'dist/',
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /.css?$/,
				loader: ['style-loader', 'css-loader'],
				exclude: /node_modules/,
			},
		],
	},
};
