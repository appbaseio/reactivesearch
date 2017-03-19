var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		app: './app/app.js'
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/dist/",
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ['shebang', 'babel']
			}
		],
		noParse: ['ws']
	},
	externals: ['ws']
};
