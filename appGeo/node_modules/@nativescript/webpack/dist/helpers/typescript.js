"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readTsConfig = exports.getTypescript = void 0;
const path_1 = require("path");
const __1 = require("..");
const log_1 = require("./log");
/**
 * @internal
 */
let typescript;
/**
 * Helper used to import typescript.
 *
 * The reason this exists is that not all flavors use Typescript, and
 * in those cases just importing this helper will throw an exception.
 */
function getTypescript() {
    if (typescript) {
        return typescript;
    }
    try {
        typescript = require('typescript');
        return typescript;
    }
    catch (err) {
        (0, log_1.warnOnce)('typescript-missing', `TypeScript is not installed in this project, but a config is trying to use it.`, __1.env.verbose
            ? new Error().stack
            : 'Run with --env.verbose to log a stack trace to help debug this further.');
        return {};
    }
}
exports.getTypescript = getTypescript;
function readTsConfig(path) {
    const { readConfigFile, parseJsonConfigFileContent, sys } = getTypescript();
    const f = readConfigFile(path, sys.readFile);
    const parsed = parseJsonConfigFileContent(f.config, {
        fileExists: sys.fileExists,
        readFile: sys.readFile,
        readDirectory: sys.readDirectory,
        useCaseSensitiveFileNames: true,
    }, (0, path_1.dirname)(path));
    return parsed;
}
exports.readTsConfig = readTsConfig;
//# sourceMappingURL=typescript.js.map