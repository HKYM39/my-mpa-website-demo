const HtmlWebpackPlugin = require("html-webpack-plugin");
const { join, resolve } = require("node:path");
module.exports = {
	devServer: {
		static: {
			directory: join(__dirname, "./dist"),
		},
		hot: true,
		port: 3000,
		proxy: [
			{
				context: ["/api"],
				target: "http://localhost:8081",
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			favicon: "./public/react.svg",
			template: resolve(__dirname, "../public/index.html"),
		}),
	],
};
