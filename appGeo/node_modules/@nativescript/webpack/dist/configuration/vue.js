"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_loader_1 = require("vue-loader");
const webpack_merge_1 = require("webpack-merge");
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("../helpers/dependencies");
const platform_1 = require("../helpers/platform");
const index_1 = require("../index");
const log_1 = require("../helpers/log");
const base_1 = __importDefault(require("./base"));
function default_1(config, env = index_1.env) {
    (0, base_1.default)(config, env);
    const platform = (0, platform_1.getPlatformName)();
    // we need to patch VueLoader if we want to enable hmr
    if (env.hmr) {
        patchVueLoaderForHMR();
    }
    // resolve .vue files
    // the order is reversed because we are using prepend!
    config.resolve.extensions.prepend('.vue').prepend(`.${platform}.vue`);
    // add a rule for .vue files
    config.module
        .rule('vue')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader('vue-loader')
        .tap((options) => {
        return Object.assign(Object.assign({}, options), { compiler: getTemplateCompiler() });
    });
    // apply vue stylePostLoader to inject component scope into the css
    // this would usually be automatic, however in NS we don't use the
    // css-loader, so VueLoader doesn't inject the rule at all.
    config.module
        .rule('css')
        .use('vue-css-loader')
        .after('css2json-loader')
        .loader('vue-loader/lib/loaders/stylePostLoader.js');
    config.module
        .rule('scss')
        .use('vue-css-loader')
        .after('css2json-loader')
        .loader('vue-loader/lib/loaders/stylePostLoader.js');
    // set up ts support in vue files
    config.module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap((options = {}) => {
        return (0, webpack_merge_1.merge)(options, {
            appendTsSuffixTo: ['\\.vue$'],
        });
    });
    config.when((0, dependencies_1.hasDependency)('typescript'), (config) => {
        config.plugin('ForkTsCheckerWebpackPlugin').tap((args) => {
            args[0] = (0, webpack_merge_1.merge)(args[0], {
                typescript: {
                    extensions: {
                        vue: {
                            enabled: true,
                            compiler: 'nativescript-vue-template-compiler',
                        },
                    },
                },
            });
            return args;
        });
    });
    // add VueLoaderPlugin as the first plugin
    config
        .plugin('VueLoaderPlugin')
        // @ts-ignore
        .before(config.plugins.values()[0].name)
        .use(vue_loader_1.VueLoaderPlugin);
    // add an alias for vue, since some plugins may try to import it
    config.resolve.alias.set('vue', 'nativescript-vue');
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
/**
 * Patches source of vue-loader to set the isServer flag to false
 * so hmr gets enabled.
 */
function patchVueLoaderForHMR() {
    try {
        const vueLoaderPath = require.resolve('vue-loader/lib/index.js');
        const source = fs_1.default.readFileSync(vueLoaderPath).toString();
        const patchedSource = source.replace(/(isServer\s=\s)(target\s===\s'node')/g, '$1false;');
        fs_1.default.writeFileSync(vueLoaderPath, patchedSource);
        delete require.cache[vueLoaderPath];
    }
    catch (err) {
        (0, log_1.error)('Failed to patch VueLoader - HMR may not work properly!');
    }
}
function getTemplateCompiler() {
    try {
        return require('nativescript-vue-template-compiler');
    }
    catch (err) {
        // ignore
    }
}
//# sourceMappingURL=vue.js.map