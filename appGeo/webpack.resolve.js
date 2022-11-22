const webpack = require("@nativescript/webpack");

module.exports = {
    resolve: {
        fallback: {
            "fs": false
        },
    }
}