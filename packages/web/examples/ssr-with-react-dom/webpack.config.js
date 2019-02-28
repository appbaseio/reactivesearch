const path = require('path');

module.exports = {
	devtool: 'inline-source-map',
	entry: {
		main: './client/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/',
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: __dirname,
			},
			{
				test: /.css?$/,
				loader: ['style-loader', 'css-loader'],
				exclude: /node_modules/,
			},
		],
	},
};
