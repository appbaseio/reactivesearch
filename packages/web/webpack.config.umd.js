const path = require("path");
const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");
// BrotliPlugin removed due to compatibility issues with newer Node versions
const CompressionPlugin = require("compression-webpack-plugin");

const config = require('./webpack.config');

module.exports = {
  ...config,
  cache: true,
  entry: "./src/index.js",
  output: {
    ...config.output,
    path: __dirname + "/umd",
    filename: "reactivesearch.umd.js",
    library: "ReactiveSearch",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    }
  ],
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.VERSION": JSON.stringify(require("./package.json").version)
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new BabiliPlugin(),
    // BrotliPlugin removed - no longer compatible with newer Node versions
    new CompressionPlugin({
      asset: "[path].gzip[query]",
      algorithm: "gzip",
      test: /\.(js|css)$/
    })
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
