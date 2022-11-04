import { ENABLE_CRASHLYTICS_HINT } from "./crashlytics-common";
export function sendCrashLog(exception) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().recordException(exception);
    }
}
export function log(msg, tag, priority) {
    if (isCrashlyticsAvailable()) {
        if (tag && priority) {
            const fullMessage = priority + '/' + tag + ': ' + msg;
            com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().log(fullMessage);
        }
        else {
            com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().log(msg);
        }
    }
}
export function setString(key, value) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }
}
export function setBool(key, value) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }
}
export function setFloat(key, value) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }
}
export function setInt(key, value) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }
}
export function setDouble(key, value) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCustomKey(key, value);
    }
}
export function setUserId(id) {
    if (isCrashlyticsAvailable()) {
        com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setUserId(id);
    }
}
export function crash() {
    if (isCrashlyticsAvailable()) {
        throw new java.lang.RuntimeException('Test Crash');
    }
}
export function setCrashlyticsCollectionEnabled(enabled) {
    com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(new java.lang.Boolean(enabled));
}
function isCrashlyticsAvailable() {
    if (typeof (com.google.firebase.crashlytics.FirebaseCrashlytics) === "undefined" || typeof (com.google.firebase.crashlytics.FirebaseCrashlytics.getInstance()) === "undefined") {
        console.log(ENABLE_CRASHLYTICS_HINT);
        return false;
    }
    return true;
}
//# sourceMappingURL=crashlytics.android.js.map