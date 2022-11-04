"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyExternalConfigs = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dependencies_1 = require("./dependencies");
const index_1 = require("../index");
const log_1 = require("./log");
const lib = __importStar(require("../index"));
/**
 * @internal
 */
function applyExternalConfigs() {
    (0, dependencies_1.getAllDependencies)().forEach((dependency) => {
        const packagePath = (0, dependencies_1.getDependencyPath)(dependency);
        if (!packagePath) {
            return;
        }
        const configPath = path_1.default.join(packagePath, 'nativescript.webpack.js');
        if (fs_1.default.existsSync(configPath)) {
            (0, log_1.info)(`Discovered config: ${configPath}`);
            (0, index_1.setCurrentPlugin)(dependency);
            try {
                const externalConfig = require(configPath);
                if (typeof externalConfig === 'function') {
                    (0, log_1.info)('Applying external config...');
                    externalConfig(lib);
                }
                else if (externalConfig) {
                    (0, log_1.info)('Merging external config...');
                    lib.mergeWebpack(externalConfig);
                }
                else {
                    (0, log_1.warn)('Unsupported external config. The config must export a function or an object.');
                }
            }
            catch (err) {
                (0, log_1.warn)(`
					Unable to apply config: ${configPath}.
					Error is: ${err}
				`);
            }
        }
    });
    (0, index_1.clearCurrentPlugin)();
}
exports.applyExternalConfigs = applyExternalConfigs;
//# sourceMappingURL=externalConfigs.js.map