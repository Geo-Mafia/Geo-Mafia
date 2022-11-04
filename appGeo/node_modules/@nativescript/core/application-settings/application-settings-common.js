export function checkKey(key) {
    if (typeof key !== 'string') {
        throw new Error("key: '" + key + "' must be a string");
    }
}
export function ensureValidValue(value, valueType) {
    if (typeof value !== valueType) {
        throw new Error("value: '" + value + "' must be a " + valueType);
    }
}
//# sourceMappingURL=application-settings-common.js.map