"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyCopyRules = exports.removeCopyRule = exports.addCopyRule = exports.additionalCopyRules = exports.copyRules = void 0;
const copy_webpack_plugin_1 = __importDefault(require("copy-webpack-plugin"));
const path_1 = require("path");
const platform_1 = require("./platform");
const __1 = require("..");
/**
 * @internal
 */
exports.copyRules = new Set([]);
/**
 * @internal
 */
exports.additionalCopyRules = [];
/**
 * Utility to add new copy rules. Accepts a glob or an object. For example
 *  - **\/*.html - copy all .html files found in any sub dir.
 *  - myFolder/* - copy all files from myFolder
 *
 * When passing an object - no additional processing is done, and it's
 * applied as-is. Make sure to set every required property.
 *
 * The path is relative to the folder of the entry file
 * (specified in the main field of the package.json)
 *
 * @param {string|object} globOrObject
 */
function addCopyRule(globOrObject) {
    if (typeof globOrObject === 'string') {
        return exports.copyRules.add(globOrObject);
    }
    exports.additionalCopyRules.push(globOrObject);
}
exports.addCopyRule = addCopyRule;
/**
 * Utility to remove a copy rule. The glob should be the exact glob
 * to remove. For example
 *  - fonts/** - to remove the default copy rule for fonts
 *
 * @param {string} glob
 */
function removeCopyRule(glob) {
    exports.copyRules.delete(glob);
}
exports.removeCopyRule = removeCopyRule;
/**
 * @internal
 */
function applyCopyRules(config) {
    const entryDir = (0, platform_1.getEntryDirPath)();
    const globOptions = {
        dot: false,
        ignore: [],
    };
    // todo: do we need to handle empty appResourcesPath?
    // (the CLI should always pass the path - maybe not required)
    if (__1.env.appResourcesPath) {
        const appResourcesFolderName = (0, path_1.basename)(__1.env.appResourcesPath);
        // ignore everything in App_Resources (regardless where they are located)
        globOptions.ignore.push(`**/${appResourcesFolderName}/**`);
    }
    config.plugin('CopyWebpackPlugin').use(copy_webpack_plugin_1.default, [
        {
            patterns: Array.from(exports.copyRules)
                // reverted: removes valid rules occasionally (ie fonts)
                // todo: re-visit in future...
                // .filter((glob) => {
                // 	if (process.env.NODE_ENV === 'test') {
                // 		return true;
                // 	}
                // 	// remove rules that do not match any paths
                // 	// prevents webpack watch mode from firing
                // 	// due to "removed" paths.
                // 	return globbySync(glob).length > 0;
                // })
                .map((glob) => ({
                from: glob,
                context: entryDir,
                noErrorOnMissing: true,
                globOptions,
            }))
                .concat(exports.additionalCopyRules),
        },
    ]);
}
exports.applyCopyRules = applyCopyRules;
//# sourceMappingURL=copyRules.js.map