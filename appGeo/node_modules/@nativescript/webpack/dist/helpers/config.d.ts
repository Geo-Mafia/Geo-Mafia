/**
 * Utility to get a value from the nativescript.config.ts file.
 *
 * @param {string} key The key to get from the config. Supports dot-notation.
 * @param defaultValue The fallback value if the key is not set in the config.
 */
export declare function getValue<T = any>(key: string, defaultValue?: any): T;
