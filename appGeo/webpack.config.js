const webpack = require("@nativescript/webpack");

module.exports = (env) => {
	webpack.init(env);

	resolve.fallback({
		fs: false
	})

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};


