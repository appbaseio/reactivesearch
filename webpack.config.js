var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: {
		ecommerce_recipe: "./examples/ecommerce/app.js",
		airbnb_recipe: "./examples/airbnb/app.js",
		news_recipe: "./examples/news/app.js",
		app: "./app/app.js"
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
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				loaders: ["shebang-loader", "babel-loader"]
			}
		],
		noParse: ['ws']
	},
	externals: ['ws']
};
