const HtmlWebpackPlugin = require("html-webpack-plugin");
const { join, resolve } = require("node:path");
module.exports = {
	devServer: {
		static: {
			directory: join(__dirname, "./dist"),
		},
		hot: true,
		port: 3000,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			favicon: "./public/react.svg",
			template: resolve(__dirname, "../public/index-prod.html"),
			cdn: {
				js: [
					"https://unpkg.com/react@18/umd/react.production.min.js",
					"https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
				],
			},
		}),
	],
	externals: {
		react: "React",
		"react-dom": "ReactDOM",
	},
};
