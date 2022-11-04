"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveConfig = exports.resolveChainableConfig = exports.mergeWebpack = exports.chainWebpack = exports.useConfig = exports.init = exports.merge = exports.Utils = exports.defaultConfigs = exports.clearCurrentPlugin = exports.setCurrentPlugin = exports.env = void 0;
// Make sure the Acorn Parser (used by Webpack) can parse ES-Stage3 code
// This must be at the top BEFORE webpack is loaded so that we can extend
// and replace the parser before webpack uses it
// Based on the issue: https://github.com/webpack/webpack/issues/10216
const acorn_stage3_1 = __importDefault(require("acorn-stage3"));
// we use require to be able to override the exports
const acorn = require('acorn');
acorn.Parser = acorn.Parser.extend(acorn_stage3_1.default);
const cli_highlight_1 = require("cli-highlight");
const webpack_merge_1 = require("webpack-merge");
Object.defineProperty(exports, "merge", { enumerable: true, get: function () { return webpack_merge_1.merge; } });
const webpack_chain_1 = __importDefault(require("webpack-chain"));
const externalConfigs_1 = require("./helpers/externalConfigs");
const flavor_1 = require("./helpers/flavor");
const log_1 = require("./helpers/log");
const configuration_1 = require("./configuration");
const helpers_1 = __importDefault(require("./helpers"));
let webpackChains = [];
let webpackMerges = [];
let explicitUseConfig = false;
let hasInitialized = false;
let currentPlugin;
/**
 * @internal
 */
exports.env = {};
/**
 * @internal
 */
function setCurrentPlugin(plugin) {
    currentPlugin = plugin;
}
exports.setCurrentPlugin = setCurrentPlugin;
/**
 * @internal
 */
function clearCurrentPlugin() {
    currentPlugin = undefined;
}
exports.clearCurrentPlugin = clearCurrentPlugin;
////// PUBLIC API
/**
 * The default flavor specific configs
 */
exports.defaultConfigs = configuration_1.configs;
/**
 * Utilities to simplify various tasks
 */
exports.Utils = helpers_1.default;
/**
 * Initialize @nativescript/webpack with the webpack env.
 * Must be called first.
 *
 * @param _env The webpack env
 */
function init(_env) {
    hasInitialized = true;
    if (_env) {
        exports.env = _env;
    }
}
exports.init = init;
/**
 * Explicitly specify the base config to use.
 * Calling this will opt-out from automatic flavor detection.
 *
 * Useful when the flavor cannot be detected due to the project structure
 * for example in a custom monorepo.
 *
 * @param config Name of the base config to use.
 */
function useConfig(config) {
    explicitUseConfig = true;
    if (config) {
        webpackChains.push({
            order: -1,
            chainFn: configuration_1.configs[config],
        });
    }
}
exports.useConfig = useConfig;
/**
 * Add a new function to be called when building the internal config using webpack-chain.
 *
 * @param chainFn A function that accepts the internal chain config, and the current environment
 * @param options Optional options to control the order in which the chain function should be applied.
 */
function chainWebpack(chainFn, options) {
    webpackChains.push({
        order: (options === null || options === void 0 ? void 0 : options.order) || 0,
        chainFn,
        plugin: currentPlugin,
    });
}
exports.chainWebpack = chainWebpack;
/**
 * Merge an object into the resolved chain config.
 *
 * @param mergeFn An object or a function that optionally returns an object (can mutate the object directly and return nothing)
 */
function mergeWebpack(mergeFn) {
    webpackMerges.push(mergeFn);
}
exports.mergeWebpack = mergeWebpack;
/**
 * Resolve a new instance of the internal chain config with all chain functions applied.
 */
function resolveChainableConfig() {
    const config = new webpack_chain_1.default();
    if (!explicitUseConfig) {
        useConfig((0, flavor_1.determineProjectFlavor)());
    }
    // apply configs from dependencies
    // todo: allow opt-out
    (0, externalConfigs_1.applyExternalConfigs)();
    webpackChains
        .splice(0)
        .sort((a, b) => {
        return a.order - b.order;
    })
        .forEach(({ chainFn, plugin }) => {
        try {
            chainFn(config, exports.env);
        }
        catch (err) {
            if (plugin) {
                // catch and print errors from plugins
                return (0, log_1.error)(`
						Unable to apply chain function from: ${plugin}.
						Error is: ${err}
					`);
            }
            // otherwise throw - as the error is likely from the user config
            // or missing env flags (eg. missing platform)
            throw err;
        }
    });
    if (exports.env.verbose) {
        (0, log_1.info)('Resolved chainable config (before merges):');
        (0, log_1.info)((0, cli_highlight_1.highlight)(config.toString(), { language: 'js' }));
    }
    return config;
}
exports.resolveChainableConfig = resolveChainableConfig;
/**
 * Resolve a "final" configuration that has all chain functions and merges applied.
 *
 * @param chainableConfig Optional chain config to use.
 */
function resolveConfig(chainableConfig = resolveChainableConfig()) {
    if (!hasInitialized) {
        throw (0, log_1.error)('resolveConfig() must be called after init()');
    }
    let config = chainableConfig.toConfig();
    // this applies webpack merges
    webpackMerges.forEach((mergeFn) => {
        if (typeof mergeFn === 'function') {
            // mergeFn is a function with optional return value
            const res = mergeFn(config, exports.env);
            if (res)
                config = (0, webpack_merge_1.merge)(config, res);
        }
        else if (mergeFn) {
            // mergeFn is a literal value (object)
            config = (0, webpack_merge_1.merge)(config, mergeFn);
        }
    });
    // return a config usable by webpack
    return config;
}
exports.resolveConfig = resolveConfig;
//# sourceMappingURL=index.js.map