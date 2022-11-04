import { ENABLE_ANALYTICS_HINT, validateAnalyticsKey, validateAnalyticsParam } from "./analytics-common";
export function logEvent(options) {
    return new Promise((resolve, reject) => {
        if (!isAnalyticsAvailable()) {
            reject(ENABLE_ANALYTICS_HINT);
            return;
        }
        try {
            const validationError = validateAnalyticsKey(options.key);
            if (validationError !== undefined) {
                reject(validationError);
                return;
            }
            const dic = NSMutableDictionary.new();
            if (options.parameters !== undefined) {
                for (let p in options.parameters) {
                    const param = options.parameters[p];
                    const validationParamError = validateAnalyticsParam(param);
                    if (validationParamError !== undefined) {
                        reject(validationParamError);
                        return;
                    }
                    if (param.value !== undefined) {
                        dic.setObjectForKey(param.value, param.key);
                    }
                }
            }
            FIRAnalytics.logEventWithNameParameters(options.key, dic);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.logEvent: " + ex);
            reject(ex);
        }
    });
}
export function logComplexEvent(options) {
    return new Promise((resolve, reject) => {
        if (!isAnalyticsAvailable()) {
            reject(ENABLE_ANALYTICS_HINT);
            return;
        }
        try {
            const dic = NSMutableDictionary.new();
            if (options.parameters !== undefined) {
                for (let p in options.parameters) {
                    const param = options.parameters[p];
                    if (param.type === "array" && param.value !== undefined) {
                        const listArray = [];
                        for (let val in param.value) {
                            const value = param.value[val];
                            if (value.parameters !== undefined) {
                                const dicTemp = NSMutableDictionary.new();
                                for (let i in value.parameters) {
                                    const item = value.parameters[i];
                                    if (item.type !== "array" && item.value !== undefined && item.key !== undefined) {
                                        dicTemp.setObjectForKey(item.value, item.key);
                                    }
                                }
                                listArray.push(dicTemp);
                            }
                        }
                        dic.setObjectForKey(listArray, param.key);
                    }
                    else if (param.type === "string" || param.type === "double" || param.type === "float" || param.type === "int" || param.type === "long" || param.type === "boolean") {
                        dic.setObjectForKey(param.value, param.key);
                    }
                }
            }
            FIRAnalytics.logEventWithNameParameters(options.key, dic);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.logEvent: " + ex);
            reject(ex);
        }
    });
}
export function setUserId(arg) {
    return new Promise((resolve, reject) => {
        if (!isAnalyticsAvailable()) {
            reject(ENABLE_ANALYTICS_HINT);
            return;
        }
        try {
            if (arg.userId === undefined) {
                reject("Argument 'userId' is missing");
                return;
            }
            FIRAnalytics.setUserID(arg.userId);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.setUserId: " + ex);
            reject(ex);
        }
    });
}
export function setUserProperty(options) {
    return new Promise((resolve, reject) => {
        if (!isAnalyticsAvailable()) {
            reject(ENABLE_ANALYTICS_HINT);
            return;
        }
        try {
            if (options.key === undefined) {
                reject("Argument 'key' is missing");
                return;
            }
            if (options.value === undefined) {
                reject("Argument 'value' is missing");
                return;
            }
            FIRAnalytics.setUserPropertyStringForName(options.value, options.key);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.setUserProperty: " + ex);
            reject(ex);
        }
    });
}
export function setScreenName(options) {
    return new Promise((resolve, reject) => {
        if (!isAnalyticsAvailable()) {
            reject(ENABLE_ANALYTICS_HINT);
            return;
        }
        try {
            if (options.screenName === undefined) {
                reject("Argument 'screenName' is missing");
                return;
            }
            FIRAnalytics.setScreenNameScreenClass(options.screenName, null);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.analytics.setScreenName: " + ex);
            reject(ex);
        }
    });
}
export function setAnalyticsCollectionEnabled(enabled) {
    if (isAnalyticsAvailable()) {
        FIRAnalytics.setAnalyticsCollectionEnabled(enabled);
    }
}
export function setSessionTimeoutDuration(seconds) {
    if (isAnalyticsAvailable()) {
        FIRAnalytics.setSessionTimeoutInterval(seconds);
    }
}
export function iOSHandleOpenURL(url) {
    if (isAnalyticsAvailable()) {
        FIRAnalytics.handleOpenURL(url);
    }
}
function isAnalyticsAvailable() {
    if (typeof (FIRAnalytics) === "undefined") {
        console.log(ENABLE_ANALYTICS_HINT);
        return false;
    }
    return true;
}
//# sourceMappingURL=analytics.ios.js.map