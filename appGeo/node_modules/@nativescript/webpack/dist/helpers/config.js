"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = void 0;
const log_1 = require("./log");
const index_1 = require("../index");
function getCLILib() {
    if (!index_1.env.nativescriptLibPath) {
        if (typeof index_1.env.nativescriptLibPath !== 'boolean') {
            (0, log_1.warnOnce)('getCLILib', `
				Cannot find NativeScript CLI path. Make sure --env.nativescriptLibPath is passed
				`);
        }
        return false;
    }
    if (typeof index_1.env.nativescriptLibPath === 'boolean') {
        return false;
    }
    return require(index_1.env.nativescriptLibPath);
}
/**
 * Utility to get a value from the nativescript.config.ts file.
 *
 * @param {string} key The key to get from the config. Supports dot-notation.
 * @param defaultValue The fallback value if the key is not set in the config.
 */
function getValue(key, defaultValue) {
    const lib = getCLILib();
    if (!lib) {
        return defaultValue;
    }
    return lib.projectConfigService.getValue(key, defaultValue);
}
exports.getValue = getValue;
//# sourceMappingURL=config.js.map