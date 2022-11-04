"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_1 = require("../helpers/project");
const dependencies_1 = require("../helpers/dependencies");
const platform_1 = require("../helpers/platform");
const index_1 = require("../index");
const log_1 = require("../helpers/log");
const base_1 = __importDefault(require("./base"));
function default_1(config, env = index_1.env) {
    (0, base_1.default)(config, env);
    const platform = (0, platform_1.getPlatformName)();
    const mode = env.production ? 'production' : 'development';
    const production = mode === 'production';
    // target('node') is the default but causes svelte-loader to detect it as a "server" render, disabling HMR
    // electron-main sneaks us past the target == 'node' check and gets us HMR
    config.target('electron-main');
    // turns out this isn't enough now. svelte uses "node" of which "electron-main" is a subset in its export map forcing imports
    // for 'svelte' to 'ssr.mjs'. We define an alias here to force it back.
    config.resolve.alias.set('svelte$', 'svelte/internal');
    // svelte-hmr still references tns-core-modules, so we shim it here for compat.
    config.resolve.alias.set('tns-core-modules', '@nativescript/core');
    // resolve .svelte files
    // the order is reversed because we are using prepend!
    config.resolve.extensions.prepend('.svelte').prepend(`.${platform}.svelte`);
    // add worker support to .svelte files (new Worker('./path'))
    config.module.rule('workers').test(/\.(js|ts|svelte)$/);
    // add a rule for .svelte files
    if ((0, dependencies_1.hasDependency)('svelte-loader')) {
        // configure using svelte-loader
        config.module
            .rule('svelte')
            .test(/\.svelte$/)
            .exclude.add(/node_modules/)
            .end()
            .use('svelte-loader')
            .loader('svelte-loader')
            .tap((options) => {
            const svelteConfig = getSvelteConfig();
            return Object.assign(Object.assign({}, options), { compilerOptions: Object.assign(Object.assign({}, svelteConfig === null || svelteConfig === void 0 ? void 0 : svelteConfig.compilerOptions), { dev: !production }), preprocess: svelteConfig === null || svelteConfig === void 0 ? void 0 : svelteConfig.preprocess, hotReload: !production, hotOptions: {
                    injectCss: false,
                    native: true,
                } });
        });
    }
    else {
        // fallback for projects still using svelte-loader-hot
        config.module
            .rule('svelte')
            .test(/\.svelte$/)
            .exclude.add(/node_modules/)
            .end()
            .use('svelte-loader-hot')
            .loader('svelte-loader-hot')
            .tap((options) => {
            const svelteConfig = getSvelteConfig();
            return Object.assign(Object.assign({}, options), { dev: !production, preprocess: getSvelteConfigPreprocessor(), hotReload: !production, hotOptions: {
                    injectCss: false,
                    native: true,
                }, 
                // Suppress A11y warnings
                onwarn(warning, warn) {
                    if (!/A11y:/.test(warning.message)) {
                        warn(warning);
                    }
                } });
        });
    }
    // todo: re-visit later, disabling by default now
    // config.plugin('DefinePlugin').tap((args) => {
    // 	args[0] = merge(args[0], {
    // 		__UI_USE_EXTERNAL_RENDERER__: true,
    // 	});
    // 	return args;
    // });
    return config;
}
exports.default = default_1;
function getSvelteConfigPreprocessor() {
    const config = getSvelteConfig();
    return config === null || config === void 0 ? void 0 : config.preprocess;
}
function getSvelteConfig() {
    try {
        return require((0, project_1.getProjectFilePath)('svelte.config.js'));
    }
    catch (err) {
        (0, log_1.error)('Could not find svelte.config.js.', err);
    }
}
//# sourceMappingURL=svelte.js.map