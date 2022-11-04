import * as common from './application-settings-common';
import { getNativeApplication } from '../application';
let sharedPreferences;
function ensureSharedPreferences() {
    if (!sharedPreferences) {
        sharedPreferences = getNativeApplication().getApplicationContext().getSharedPreferences('prefs.db', 0);
    }
}
function verify(key) {
    common.checkKey(key);
    ensureSharedPreferences();
}
export function hasKey(key) {
    verify(key);
    return sharedPreferences.contains(key);
}
// getters
export function getBoolean(key, defaultValue) {
    verify(key);
    if (hasKey(key)) {
        return sharedPreferences.getBoolean(key, false);
    }
    return defaultValue;
}
export function getString(key, defaultValue) {
    verify(key);
    if (hasKey(key)) {
        return sharedPreferences.getString(key, '');
    }
    return defaultValue;
}
export function getNumber(key, defaultValue) {
    verify(key);
    if (hasKey(key)) {
        return sharedPreferences.getFloat(key, float(0.0));
    }
    return defaultValue;
}
// setters
export function setBoolean(key, value) {
    verify(key);
    common.ensureValidValue(value, 'boolean');
    const editor = sharedPreferences.edit();
    editor.putBoolean(key, value);
    editor.apply();
}
export function setString(key, value) {
    verify(key);
    common.ensureValidValue(value, 'string');
    const editor = sharedPreferences.edit();
    editor.putString(key, value);
    editor.apply();
}
export function setNumber(key, value) {
    verify(key);
    common.ensureValidValue(value, 'number');
    const editor = sharedPreferences.edit();
    editor.putFloat(key, float(value));
    editor.apply();
}
export function remove(key) {
    verify(key);
    const editor = sharedPreferences.edit();
    editor.remove(key);
    editor.apply();
}
export function clear() {
    ensureSharedPreferences();
    sharedPreferences.edit().clear().apply();
}
export function flush() {
    ensureSharedPreferences();
    return sharedPreferences.edit().commit();
}
export function getAllKeys() {
    ensureSharedPreferences();
    const mappedPreferences = sharedPreferences.getAll();
    const iterator = mappedPreferences.keySet().iterator();
    const result = [];
    while (iterator.hasNext()) {
        const key = iterator.next();
        result.push(key);
    }
    return result;
}
//# sourceMappingURL=index.android.js.map