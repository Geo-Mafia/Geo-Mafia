"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chainedSetAddAfter = void 0;
/**
 * Helper to insert values after a specific item in a ChainedSet.
 *
 * @param chainedSet
 * @param after
 * @param itemToAdd
 */
function chainedSetAddAfter(chainedSet, after, itemToAdd) {
    const values = chainedSet.values();
    if (values.includes(after)) {
        values.splice(values.indexOf(after) + 1, 0, itemToAdd);
    }
    else {
        values.push(itemToAdd);
    }
    chainedSet.clear().merge(values);
}
exports.chainedSetAddAfter = chainedSetAddAfter;
//# sourceMappingURL=chain.js.map