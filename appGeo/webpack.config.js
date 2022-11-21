const webpack = require("@nativescript/webpack");
const Dotenv = require("dotenv-webpack")

module.exports = {
	plugins: [
		new Dotenv({systemvars: true}),
	],
	resolve: {
        fallback: {
            "fs": false
        },
    },
}

/*
(env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
};
*/