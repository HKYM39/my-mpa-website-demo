const { join, resolve } = require("path");
const webpack = require("webpack");
require("dotenv").config({ path: resolve(__dirname, "../.env") });
const merge = require("webpack-merge");
const _args = require("yargs-parser")(process.argv.slice(2));
const _mode = _args.mode || "development";
const _mergeConfig = require(`${__dirname}/configs/webpack.${_mode}.js`);
const isDev = _mode === "development";

const config = {
	mode: "development",
	entry: "./src/main.tsx",
	output: {
		filename: "bundle.[contenthash].js",
		// 【关键点】：利用 path.resolve 跳出当前目录，指向后端的目录
		// 这里的 ../backend/client 对应 NestJS 中配置的 rootPath
		path: resolve(__dirname, "../backend/src/views"),
		publicPath: "/",
		clean: true,
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
									runtime: "automatic",
									development: isDev,
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
			"process.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL),
		}),
	],
};

module.exports = merge.default(config, _mergeConfig);
