const webpack = require("@nativescript/webpack");
const resolve = require("./webpack.resolve")

module.exports = (resolve, (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
});