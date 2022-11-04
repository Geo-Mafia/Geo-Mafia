"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ts_dedent_1 = __importDefault(require("ts-dedent"));
const fs_1 = __importDefault(require("fs"));
// note: this will bail even if module.hot appears in a comment
const MODULE_HOT_RE = /module\.hot/;
function loader(content, map) {
    var _a;
    if (MODULE_HOT_RE.test(content)) {
        // Code already handles HMR - we don't need to do anything
        return this.callback(null, content, map);
    }
    const opts = this.getOptions();
    // used to inject the HMR runtime into the entry file
    if (opts.injectHMRRuntime) {
        const hmrRuntimePath = (0, path_1.resolve)(__dirname, './hmr.runtime.js');
        const hmrRuntime = fs_1.default
            .readFileSync(hmrRuntimePath)
            .toString()
            .split('// ---')[1]
            .replace('//# sourceMappingURL=hmr.runtime.js.map', '');
        return this.callback(null, `${content}\n${hmrRuntime}`, map);
    }
    const relativePath = (0, path_1.relative)((_a = opts.appPath) !== null && _a !== void 0 ? _a : this.rootContext, this.resourcePath).replace(/\\/g, '/');
    const hmrCode = this.hot
        ? (0, ts_dedent_1.default) `
			/* NATIVESCRIPT-HOT-LOADER */
			if(module.hot && global._isModuleLoadedForUI && global._isModuleLoadedForUI("./${relativePath}")) {
				module.hot.accept()
			}
		`
        : ``;
    const source = `${content}\n${hmrCode}`;
    this.callback(null, source, map);
}
exports.default = loader;
//# sourceMappingURL=index.js.map