"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineProjectFlavor = void 0;
const dependencies_1 = require("./dependencies");
const log_1 = require("./log");
/**
 * Utility to determine the project flavor based on installed dependencies
 * (vue, angular, react, svelete, typescript, javascript...)
 */
function determineProjectFlavor() {
    const dependencies = (0, dependencies_1.getAllDependencies)();
    if (dependencies.includes('nativescript-vue')) {
        return 'vue';
    }
    if (dependencies.includes('@nativescript/angular')) {
        return 'angular';
    }
    if (dependencies.includes('react-nativescript')) {
        return 'react';
    }
    if (dependencies.includes('svelte-native')) {
        return 'svelte';
    }
    // the order is important - angular, react, and svelte also include these deps
    // but should return prior to this condition!
    if (dependencies.includes('@nativescript/core') &&
        dependencies.includes('typescript')) {
        return 'typescript';
    }
    if (dependencies.includes('@nativescript/core')) {
        return 'javascript';
    }
    (0, log_1.error)(`
		Could not determine project flavor.
		Please use webpack.useConfig('<flavor>') to explicitly set the base config.
	`);
    return false;
}
exports.determineProjectFlavor = determineProjectFlavor;
//# sourceMappingURL=flavor.js.map