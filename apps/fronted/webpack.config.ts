const { join, resolve } = require("path");
const webpack = require("webpack");
require("dotenv").config({ path: resolve(__dirname, "../.env") });
const merge = require("webpack-merge");
const _args = require("yargs-parser")(process.argv.slice(2));
const _mode = _args.mode || "development";
const _mergeConfig = require(`${__dirname}/configs/webpack.${_mode}.js`);

const config = {
	mode: "development",
	entry: "./src/main.tsx",
	output: {
		path: join(__dirname, "./dist"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: {
					loader: "swc-loader",
					options: {
						jsc: {
							parser: {
								syntax: "typescript",
								tsx: true,
							},
							transform: {
								react: {
									runtime: "automatic", // ✅ React 17+ 必须
									development: true,
								},
							},
						},
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				type: "asset",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	devServer: {
		port: 3000,
		hot: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.API_BASE_URL": JSON.stringify(
				process.env.API_BASE_URL || "http://localhost:3000/api",
			),
		}),
	],
};

module.exports = merge.default(config, _mergeConfig);
