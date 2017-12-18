const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: {
		TextField: "./examples/TextField/index.js",
		MultiList: "./examples/MultiList/index.js",
		SingleList: "./examples/SingleList/index.js",
		DataSearch: "./examples/DataSearch/index.js",
		ToggleButton: "./examples/ToggleButton/index.js",
		NumberBox: "./examples/NumberBox/index.js",
		SingleDropdownList: "./examples/SingleDropdownList/index.js",
		MultiDropdownList: "./examples/MultiDropdownList/index.js",
		SingleDropdownRange: "./examples/SingleDropdownRange/index.js",
		MultiDropdownRange: "./examples/MultiDropdownRange/index.js",
		RangeSlider: "./examples/RangeSlider/index.js",
		DynamicRangeSlider: "./examples/DynamicRangeSlider/index.js",
		RangeInput: "./examples/RangeInput/index.js",
		ReactiveComponent: "./examples/ReactiveComponent/index.js",
		DatePicker: "./examples/DatePicker/index.js",
		DateRange: "./examples/DateRange/index.js"
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
