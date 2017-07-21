module.exports = {
	module: {
		rules: [
			{
				test: /node_modules\/JSONStream\/index\.js$/,
				use: ["shebang-loader", "babel-loader"]
			},
			{
				test: /\.md$/,
				loader: "raw-loader"
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
				use : "file-loader"
			}
		]
	},
	externals: ["ws"]
}
