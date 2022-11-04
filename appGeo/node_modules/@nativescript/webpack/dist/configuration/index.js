"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configs = void 0;
const base_1 = __importDefault(require("./base"));
const angular_1 = __importDefault(require("./angular"));
const javascript_1 = __importDefault(require("./javascript"));
const react_1 = __importDefault(require("./react"));
const svelte_1 = __importDefault(require("./svelte"));
const typescript_1 = __importDefault(require("./typescript"));
const vue_1 = __importDefault(require("./vue"));
exports.configs = {
    base: base_1.default,
    angular: angular_1.default,
    javascript: javascript_1.default,
    react: react_1.default,
    svelte: svelte_1.default,
    typescript: typescript_1.default,
    vue: vue_1.default,
};
//# sourceMappingURL=index.js.map