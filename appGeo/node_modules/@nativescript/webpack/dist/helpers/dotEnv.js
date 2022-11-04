"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyDotEnvPlugin = void 0;
const dotenv_webpack_1 = __importDefault(require("dotenv-webpack"));
const fs_1 = require("fs");
const path_1 = require("path");
const project_1 = require("./project");
const __1 = require("..");
/**
 * @internal
 */
function applyDotEnvPlugin(config) {
    const path = getDotEnvPath();
    config.when(path !== null, (config) => {
        config.plugin('DotEnvPlugin').use(dotenv_webpack_1.default, [
            {
                path,
                silent: true, // hide any errors
            },
        ]);
    });
}
exports.applyDotEnvPlugin = applyDotEnvPlugin;
function getDotEnvFileName() {
    if (__1.env.env) {
        return `.env.${__1.env.env}`;
    }
    return '.env';
}
function getDotEnvPath() {
    const dotEnvPath = (0, path_1.resolve)((0, project_1.getProjectRootPath)(), '.env');
    const dotEnvWithEnvPath = (0, path_1.resolve)((0, project_1.getProjectRootPath)(), getDotEnvFileName());
    // look for .env.<env>
    if ((0, fs_1.existsSync)(dotEnvWithEnvPath)) {
        return dotEnvWithEnvPath;
    }
    // fall back to .env
    if ((0, fs_1.existsSync)(dotEnvPath)) {
        return dotEnvPath;
    }
    // don't use .env
    return null;
}
//# sourceMappingURL=dotEnv.js.map