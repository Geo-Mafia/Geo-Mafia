import { ENABLE_CRASHLYTICS_HINT } from "./crashlytics-common";
export function sendCrashLog(exception) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().recordError(exception);
    }
}
export function log(msg, tag, priority) {
    if (isCrashlyticsAvailable()) {
        if (tag) {
            FIRCrashlytics.crashlytics().log(tag + " - " + msg);
        }
        else {
            FIRCrashlytics.crashlytics().log(msg);
        }
    }
}
export function setString(key, value) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCustomValueForKey(value, key);
    }
}
export function setBool(key, value) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCustomValueForKey(value, key);
    }
}
export function setFloat(key, value) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCustomValueForKey(value, key);
    }
}
export function setInt(key, value) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCustomValueForKey(value, key);
    }
}
export function setDouble(key, value) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCustomValueForKey(value, key);
    }
}
export function setUserId(id) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setUserID(id);
    }
}
export function crash() {
    if (isCrashlyticsAvailable()) {
        NSException.exceptionWithNameReasonUserInfo("FIRCrashlytics", "test crash", null).raise();
    }
}
export function setCrashlyticsCollectionEnabled(enabled) {
    if (isCrashlyticsAvailable()) {
        FIRCrashlytics.crashlytics().setCrashlyticsCollectionEnabled(enabled);
    }
}
function isCrashlyticsAvailable() {
    if (typeof (FIRCrashlytics) === "undefined") {
        console.log(ENABLE_CRASHLYTICS_HINT);
        return false;
    }
    return true;
}
//# sourceMappingURL=crashlytics.ios.js.map