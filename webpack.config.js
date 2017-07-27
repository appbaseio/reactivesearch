const path = require("path");
const webpack = require("webpack");
const env = process.env.NODE_ENV;
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

const main_config = {
	entry: {
		ecommerce_recipe: "./examples/ecommerce/app.js",
		meetup_recipe: "./examples/whosintown/app.js",
		yelp_recipe: "./examples/yelpsearch/app.js",
		producthunt_recipe: "./examples/productsearch/app.js",
		airbnb_recipe: "./examples/airbeds/app.js",
		simplebeds_recipe: "./examples/simplebeds/app.js",
		news_recipe: "./examples/news/app.js",
		CategorySearch: "./examples/CategorySearch/app.js",
		NestedList: "./examples/NestedList/app.js",
		RatingsFilter: "./examples/RatingsFilter/app.js",
		TagCloud: "./examples/TagCloud/app.js",
		ToggleList: "./examples/ToggleList/app.js",
		app: "./app/app.js"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].bundle.js",
		publicPath: "/dist/"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: "babel-loader",
				include: [
					path.resolve(__dirname, "app"),
					path.resolve(__dirname, "examples")
				],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				use: ["shebang-loader", "babel-loader"]
			}
		]
	},
	externals: ["ws"]
};

const build_config = {
	entry: {
		ecommerce_recipe: "./examples/ecommerce/app.js",
		meetup_recipe: "./examples/whosintown/app.js",
		yelp_recipe: "./examples/yelpsearch/app.js",
		producthunt_recipe: "./examples/productsearch/app.js",
		airbnb_recipe: "./examples/airbeds/app.js",
		simplebeds_recipe: "./examples/simplebeds/app.js",
		news_recipe: "./examples/news/app.js",
		CategorySearch: "./examples/CategorySearch/app.js",
		NestedList: "./examples/NestedList/app.js",
		RatingsFilter: "./examples/RatingsFilter/app.js",
		TagCloud: "./examples/TagCloud/app.js",
		ToggleList: "./examples/ToggleList/app.js"
	},
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].bundle.js",
		publicPath: "/dist/"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: "babel-loader",
				include: [
					path.resolve(__dirname, "app"),
					path.resolve(__dirname, "examples")
				],
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				use: ["shebang-loader", "babel-loader"]
			}
		]
	},
	externals: ["ws"],
	plugins: [
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new LodashModuleReplacementPlugin({
			collections: true,
			shorthands: true,
			paths: true
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				screw_ie8: true,
				conditionals: true,
				unused: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				join_vars: true,
				if_return: true
			},
			output: {
				comments: false
			}
		})
	]
};

let config = main_config;

if (env === "production") {
	config = build_config;
}

module.exports = config;
