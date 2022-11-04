"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPS = void 0;
const os_1 = __importDefault(require("os"));
function getIPS() {
    const interfaces = os_1.default.networkInterfaces();
    return Object.keys(interfaces)
        .map((name) => {
        return interfaces[name].filter((binding) => binding.family === 'IPv4' || binding.family === 4)[0];
    })
        .filter((binding) => !!binding)
        .map((binding) => binding.address);
}
exports.getIPS = getIPS;
//# sourceMappingURL=host.js.map