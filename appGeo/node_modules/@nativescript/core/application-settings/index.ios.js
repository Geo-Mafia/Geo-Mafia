import * as Common from './application-settings-common';
import * as utils from '../utils';
const userDefaults = NSUserDefaults.standardUserDefaults;
export function hasKey(key) {
    Common.checkKey(key);
    return userDefaults.objectForKey(key) !== null;
}
// utils.ios.getters
export function getBoolean(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.boolForKey(key);
    }
    return defaultValue;
}
export function getString(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.stringForKey(key);
    }
    return defaultValue;
}
export function getNumber(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.doubleForKey(key);
    }
    return defaultValue;
}
// setters
export function setBoolean(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, 'boolean');
    userDefaults.setBoolForKey(value, key);
}
export function setString(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, 'string');
    userDefaults.setObjectForKey(value, key);
}
export function setNumber(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, 'number');
    userDefaults.setDoubleForKey(value, key);
}
export function remove(key) {
    Common.checkKey(key);
    userDefaults.removeObjectForKey(key);
}
export function clear() {
    userDefaults.removePersistentDomainForName(NSBundle.mainBundle.bundleIdentifier);
}
export function flush() {
    return userDefaults.synchronize();
}
export function getAllKeys() {
    return utils.iOSNativeHelper.collections.nsArrayToJSArray(userDefaults.dictionaryRepresentation().allKeys);
}
//# sourceMappingURL=index.ios.js.map