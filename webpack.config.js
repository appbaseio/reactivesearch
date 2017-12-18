const path = require("path");
const webpack = require("webpack");

const config = {
	context: path.resolve(__dirname, "src"),
	entry: {
		main: "./index.js"
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "build.js",
		publicPath: "dist/"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: "babel-loader",
				exclude: /node_modules/
			}
		]
	}
}

if (process.env.NODE_ENV === "production") {
	config.plugins = [
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
		})
	]
};

module.exports = config;
