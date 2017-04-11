const path = require('path');
const webpack = require('webpack');
const CHOOSE_CONFIG = process.env.CHOOSE_CONFIG;

const default_config = {
	entry: {
		ecommerce_recipe: "./examples/ecommerce/app.js",
		meetup_recipe: "./examples/whosintown/app.js",
		yelp_recipe: "./examples/yelpsearch/app.js",
		producthunt_recipe: "./examples/productsearch/app.js",
		airbnb_recipe: "./examples/airbeds/app.js",
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

const examples_config = {
	entry: {
		ecommerce_recipe: "./examples/ecommerce/app.js",
		meetup_recipe: "./examples/whosintown/app.js",
		yelp_recipe: "./examples/yelpsearch/app.js",
		producthunt_recipe: "./examples/productsearch/app.js",
		airbnb_recipe: "./examples/airbeds/app.js",
		news_recipe: "./examples/news/app.js"
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
	externals: ['ws'],
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			mangle: true,
			sourcemap: false,
			beautify: false,
			dead_code: true
		}),
	]
};

const lib_config = {
	entry: {
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

let final_config;
switch(CHOOSE_CONFIG) {
	case 'EXAMPLES':
		final_config = examples_config;
		break;
	case 'LIB':
		final_config = lib_config;
		break;
	default:
		final_config = default_config;
}

module.exports = final_config;
