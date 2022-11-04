"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_1 = require("../helpers/platform");
const chain_1 = require("../helpers/chain");
const index_1 = require("../index");
const webpack_1 = require("webpack");
const base_1 = __importDefault(require("./base"));
const path_1 = __importDefault(require("path"));
function default_1(config, env = index_1.env) {
    (0, base_1.default)(config, env);
    const entryPath = (0, platform_1.getEntryPath)();
    const virtualEntryPath = path_1.default.resolve(__dirname, '../stubs/virtual-entry-javascript');
    // exclude files starting with _ from require.context
    config
        .plugin(`ContextExclusionPlugin|exclude_files`)
        .use(webpack_1.ContextExclusionPlugin, [/\b_.+\./]);
    (0, chain_1.chainedSetAddAfter)(config.entry('bundle'), '@nativescript/core/globals/index', virtualEntryPath);
    config.when(env.hmr, (config) => {
        // set up core HMR
        config.module
            .rule('hmr-core')
            .before('js')
            .test(/\.js$/)
            .exclude.add(/node_modules/)
            .add(entryPath)
            .end()
            .use('nativescript-hot-loader')
            .loader('nativescript-hot-loader')
            .options({
            appPath: (0, platform_1.getEntryDirPath)(),
        });
    });
    return config;
}
exports.default = default_1;
//# sourceMappingURL=javascript.js.map