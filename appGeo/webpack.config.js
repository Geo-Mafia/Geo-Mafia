const webpack = require("@nativescript/webpack");
const Dotenv = require("dotenv-webpack")

module.exports = (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};