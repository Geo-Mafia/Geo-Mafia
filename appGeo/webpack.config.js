"use strict"

const webpack = require("@nativescript/webpack");

const mode = process.env.NODE_ENV === "production" ? "production" : "development";


module.exports = {
	// WARNING: MUST set the 'mode' manually because it isn't done by NX/NG cli
	mode,
	resolve: {
        fallback: {
            "fs": false
        },
    }
}

/*
module.exports = (resolve, (env) => {
	webpack.init(env);

	// Learn how to customize:
	// https://docs.nativescript.org/webpack

	return webpack.resolveConfig();
});
*/