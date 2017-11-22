const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		TextField: "./examples/TextField/index.js"
	},
	output: {
		path: path.join(__dirname, "examples"),
		filename: "[name].bundle.js"
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				use: "babel-loader",
				include: [
					path.resolve(__dirname, "src"),
					path.resolve(__dirname, "examples")
				],
				exclude: /node_modules/
			}
		]
	}
};
