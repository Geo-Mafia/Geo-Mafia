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
export declare function addCopyRule(globOrObject: string | object): Set<any>;
/**
 * Utility to remove a copy rule. The glob should be the exact glob
 * to remove. For example
 *  - fonts/** - to remove the default copy rule for fonts
 *
 * @param {string} glob
 */
export declare function removeCopyRule(glob: string): void;
