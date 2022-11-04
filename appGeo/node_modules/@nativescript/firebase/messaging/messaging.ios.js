import { SharedNotificationDelegate } from "@nativescript/shared-notification-delegate";
import { Application, ApplicationSettings, Device } from "@nativescript/core";
import { firebase } from "../firebase-common";
import { firebaseUtils } from "../utils";
let _notificationActionTakenCallback;
let _pendingNotifications = [];
let _pendingActionTakenNotifications = [];
let _pushToken;
let _receivedPushTokenCallback;
let _receivedNotificationCallback;
let _registerForRemoteNotificationsRanThisSession = false;
let _userNotificationCenterDelegateObserver;
let _firebaseRemoteMessageDelegate;
let _showNotifications = true;
let _showNotificationsWhenInForeground = false;
let _autoClearBadge = true;
let _resolveWhenDidRegisterForNotifications;
let _rejectWhenDidFailToRegisterForNotifications;
const NOTIFICATIONS_REGISTRATION_KEY = "Firebase-RegisterForRemoteNotifications";
export function initFirebaseMessaging(options) {
    if (!options) {
        return;
    }
    _showNotifications = options.showNotifications === undefined ? _showNotifications : !!options.showNotifications;
    _showNotificationsWhenInForeground = options.showNotificationsWhenInForeground === undefined ? _showNotificationsWhenInForeground : !!options.showNotificationsWhenInForeground;
    _autoClearBadge = options.autoClearBadge === undefined ? _autoClearBadge : !!options.autoClearBadge;
    if (options.onMessageReceivedCallback !== undefined) {
        addOnMessageReceivedCallback(options.onMessageReceivedCallback);
    }
    if (options.onPushTokenReceivedCallback !== undefined) {
        addOnPushTokenReceivedCallback(options.onPushTokenReceivedCallback);
    }
}
export function addOnMessageReceivedCallback(callback) {
    return new Promise((resolve, reject) => {
        try {
            ApplicationSettings.setBoolean(NOTIFICATIONS_REGISTRATION_KEY, true);
            _receivedNotificationCallback = callback;
            _registerForRemoteNotifications(resolve, reject);
            _processPendingNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.addOnMessageReceivedCallback: " + ex);
            reject(ex);
        }
    });
}
export function getCurrentPushToken() {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (FIRMessaging) !== "undefined") {
                resolve(FIRMessaging.messaging().FCMToken);
            }
            else {
                resolve(_pushToken);
            }
        }
        catch (ex) {
            console.log("Error in messaging.getCurrentPushToken: " + ex);
            reject(ex);
        }
    });
}
export function registerForPushNotifications(options) {
    return new Promise((resolve, reject) => {
        try {
            initFirebaseMessaging(options);
            _registerForRemoteNotificationsRanThisSession = false;
            _registerForRemoteNotifications(resolve, reject);
        }
        catch (ex) {
            console.log("Error in messaging.registerForPushNotifications: " + ex);
            reject(ex);
        }
    });
}
export function unregisterForPushNotifications() {
    return new Promise((resolve, reject) => {
        try {
            UIApplication.sharedApplication.unregisterForRemoteNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.unregisterForPushNotifications: " + ex);
            reject(ex);
        }
    });
}
export function handleRemoteNotification(app, userInfo) {
    const userInfoJSON = firebaseUtils.toJsObject(userInfo);
    const aps = userInfo.objectForKey("aps");
    if (aps !== null) {
        const alrt = aps.objectForKey("alert");
        if (alrt !== null && alrt.objectForKey) {
            userInfoJSON.title = alrt.objectForKey("title");
            userInfoJSON.body = alrt.objectForKey("body");
        }
    }
    userInfoJSON.foreground = app.applicationState === 0;
    updateUserInfo(userInfoJSON);
    _pendingNotifications.push(userInfoJSON);
    if (_receivedNotificationCallback) {
        _processPendingNotifications();
    }
}
export function addOnPushTokenReceivedCallback(callback) {
    return new Promise((resolve, reject) => {
        try {
            _receivedPushTokenCallback = callback;
            if (_pushToken) {
                callback(_pushToken);
            }
            ApplicationSettings.setBoolean(NOTIFICATIONS_REGISTRATION_KEY, true);
            _registerForRemoteNotifications();
            _processPendingNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging.addOnPushTokenReceivedCallback: " + ex);
            reject(ex);
        }
    });
}
export function addBackgroundRemoteNotificationHandler(appDelegate) {
    appDelegate.prototype.applicationDidRegisterForRemoteNotificationsWithDeviceToken = (application, deviceToken) => {
        if (areNotificationsEnabled()) {
            _resolveWhenDidRegisterForNotifications && _resolveWhenDidRegisterForNotifications();
        }
        else {
            _rejectWhenDidFailToRegisterForNotifications && _rejectWhenDidFailToRegisterForNotifications();
        }
        if (typeof (FIRMessaging) !== "undefined") {
            FIRMessaging.messaging().APNSToken = deviceToken;
        }
        else {
            const token = deviceToken.debugDescription.replace(/[< >]/g, "");
            _pushToken = token;
            if (_receivedPushTokenCallback) {
                _receivedPushTokenCallback(token);
            }
        }
    };
    appDelegate.prototype.applicationDidFailToRegisterForRemoteNotificationsWithError = (application, error) => {
        if (error.localizedDescription.indexOf("not supported in the simulator") > -1) {
            _resolveWhenDidRegisterForNotifications && _resolveWhenDidRegisterForNotifications();
        }
        else {
            _rejectWhenDidFailToRegisterForNotifications && _rejectWhenDidFailToRegisterForNotifications(error.localizedDescription);
        }
    };
    appDelegate.prototype.applicationDidReceiveRemoteNotificationFetchCompletionHandler = (app, notification, completionHandler) => {
        if (typeof (FIRAuth) !== "undefined") {
            if (firebase._configured && FIRAuth.auth().canHandleNotification(notification)) {
                completionHandler(1);
                return;
            }
        }
        completionHandler(0);
        handleRemoteNotification(app, notification);
    };
}
export function registerForInteractivePush(model) {
    let nativeActions = [];
    model.iosSettings.interactiveSettings.actions.forEach(((action) => {
        let notificationActionOptions = action.options ? action.options.valueOf() : UNNotificationActionOptionNone;
        let actionType = action.type || "button";
        let nativeAction;
        if (actionType === "input") {
            nativeAction = UNTextInputNotificationAction.actionWithIdentifierTitleOptionsTextInputButtonTitleTextInputPlaceholder(action.identifier, action.title, notificationActionOptions, action.submitLabel || "Submit", action.placeholder);
        }
        else if (actionType === "button") {
            nativeAction = UNNotificationAction.actionWithIdentifierTitleOptions(action.identifier, action.title, notificationActionOptions);
        }
        else {
            console.log("Unsupported action type: " + action.type);
        }
        nativeActions.push(nativeAction);
    }));
    let actions = NSArray.arrayWithArray(nativeActions);
    let nativeCategories = [];
    model.iosSettings.interactiveSettings.categories.forEach(category => {
        let nativeCategory = UNNotificationCategory.categoryWithIdentifierActionsIntentIdentifiersOptions(category.identifier, actions, null, null);
        nativeCategories.push(nativeCategory);
    });
    const nsSetCategories = new NSSet(nativeCategories);
    UNUserNotificationCenter.currentNotificationCenter().setNotificationCategories(nsSetCategories);
    if (model.onNotificationActionTakenCallback) {
        _addOnNotificationActionTakenCallback(model.onNotificationActionTakenCallback);
    }
}
export function prepAppDelegate() {
    _addObserver("com.firebase.iid.notif.refresh-token", notification => onTokenRefreshNotification(notification.object));
    _addObserver(UIApplicationDidFinishLaunchingNotification, appNotification => {
        if (ApplicationSettings.getBoolean(NOTIFICATIONS_REGISTRATION_KEY, false)) {
            _registerForRemoteNotifications();
        }
    });
    _addObserver(UIApplicationDidBecomeActiveNotification, appNotification => {
        _processPendingNotifications();
    });
}
export function subscribeToTopic(topicName) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            FIRMessaging.messaging().subscribeToTopicCompletion(topicName, (error) => {
                error ? reject(error.localizedDescription) : resolve();
            });
        }
        catch (ex) {
            console.log("Error in messaging.subscribeToTopic: " + ex);
            reject(ex);
        }
    });
}
export function unsubscribeFromTopic(topicName) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (FIRMessaging) === "undefined") {
                reject("Enable FIRMessaging in Podfile first");
                return;
            }
            FIRMessaging.messaging().unsubscribeFromTopicCompletion(topicName, error => {
                error ? reject(error.localizedDescription) : resolve();
            });
        }
        catch (ex) {
            console.log("Error in messaging.unsubscribeFromTopic: " + ex);
            reject(ex);
        }
    });
}
export const onTokenRefreshNotification = token => {
    _pushToken = token;
    if (_receivedPushTokenCallback) {
        _receivedPushTokenCallback(token);
    }
};
export class IosInteractivePushSettings {
}
export var IosInteractiveNotificationActionOptions;
(function (IosInteractiveNotificationActionOptions) {
    IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["authenticationRequired"] = 1] = "authenticationRequired";
    IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["destructive"] = 2] = "destructive";
    IosInteractiveNotificationActionOptions[IosInteractiveNotificationActionOptions["foreground"] = 4] = "foreground";
})(IosInteractiveNotificationActionOptions || (IosInteractiveNotificationActionOptions = {}));
export class IosPushSettings {
}
export class PushNotificationModel {
}
export class NotificationActionResponse {
}
export function areNotificationsEnabled() {
    return UIApplication.sharedApplication.currentUserNotificationSettings.types > 0;
}
const updateUserInfo = userInfoJSON => {
    if (userInfoJSON.aps && userInfoJSON.aps.alert) {
        userInfoJSON.title = userInfoJSON.aps.alert.title;
        userInfoJSON.body = userInfoJSON.aps.alert.body;
    }
    if (!userInfoJSON.hasOwnProperty("data")) {
        userInfoJSON.data = {};
    }
    Object.keys(userInfoJSON).forEach(key => {
        if (key !== "data")
            userInfoJSON.data[key] = userInfoJSON[key];
    });
    userInfoJSON.aps = undefined;
};
function _registerForRemoteNotifications(resolve, reject) {
    let app = UIApplication.sharedApplication;
    if (!app) {
        Application.on(Application.launchEvent, () => _registerForRemoteNotifications(resolve, reject));
        return;
    }
    if (_registerForRemoteNotificationsRanThisSession) {
        resolve && resolve();
        return;
    }
    _registerForRemoteNotificationsRanThisSession = true;
    _resolveWhenDidRegisterForNotifications = resolve;
    _rejectWhenDidFailToRegisterForNotifications = reject;
    if (parseInt(Device.osVersion) >= 10) {
        const authorizationOptions = 4 | 2 | 1;
        UNUserNotificationCenter.currentNotificationCenter().requestAuthorizationWithOptionsCompletionHandler(authorizationOptions, (granted, error) => {
            if (!error) {
                if (app === null) {
                    app = UIApplication.sharedApplication;
                }
                if (app !== null) {
                    firebaseUtils.invokeOnRunLoop(() => app.registerForRemoteNotifications());
                }
            }
            else {
                console.log("Error requesting push notification auth: " + error);
                reject && reject(error.localizedDescription);
            }
        });
        if (_showNotifications) {
            _userNotificationCenterDelegateObserver = new FirebaseNotificationDelegateObserverImpl((unnotification, actionIdentifier, inputText) => {
                const userInfo = unnotification.request.content.userInfo;
                const userInfoJSON = firebaseUtils.toJsObject(userInfo);
                updateUserInfo(userInfoJSON);
                if (actionIdentifier) {
                    _pendingActionTakenNotifications.push({
                        actionIdentifier,
                        userInfoJSON,
                        inputText
                    });
                    if (_notificationActionTakenCallback) {
                        _processPendingActionTakenNotifications();
                    }
                    userInfoJSON.notificationTapped = actionIdentifier === UNNotificationDefaultActionIdentifier;
                }
                else {
                    userInfoJSON.notificationTapped = false;
                }
                userInfoJSON.foreground = UIApplication.sharedApplication.applicationState === 0;
                _pendingNotifications.push(userInfoJSON);
                if (_receivedNotificationCallback) {
                    _processPendingNotifications();
                }
            });
            SharedNotificationDelegate.addObserver(_userNotificationCenterDelegateObserver);
        }
        if (typeof (FIRMessaging) !== "undefined") {
            _firebaseRemoteMessageDelegate = FIRMessagingDelegateImpl.new().initWithCallback((appDataDictionary) => {
                const userInfoJSON = firebaseUtils.toJsObject(appDataDictionary);
                updateUserInfo(userInfoJSON);
                _pendingNotifications.push(userInfoJSON);
                const asJs = firebaseUtils.toJsObject(appDataDictionary.objectForKey("notification"));
                if (asJs) {
                    userInfoJSON.title = asJs.title;
                    userInfoJSON.body = asJs.body;
                }
                const app = UIApplication.sharedApplication;
                if (app.applicationState === 0) {
                    userInfoJSON.foreground = true;
                    if (_receivedNotificationCallback) {
                        _processPendingNotifications();
                    }
                }
                else {
                    userInfoJSON.foreground = false;
                }
            });
            FIRMessaging.messaging().delegate = _firebaseRemoteMessageDelegate;
        }
    }
    else {
        const notificationTypes = 4 | 1 | 2 | 1;
        const notificationSettings = UIUserNotificationSettings.settingsForTypesCategories(notificationTypes, null);
        firebaseUtils.invokeOnRunLoop(() => {
            app.registerForRemoteNotifications();
        });
        app.registerUserNotificationSettings(notificationSettings);
    }
}
function _addOnNotificationActionTakenCallback(callback) {
    return new Promise((resolve, reject) => {
        try {
            _notificationActionTakenCallback = callback;
            _processPendingActionTakenNotifications();
            resolve();
        }
        catch (ex) {
            console.log("Error in messaging._addOnNotificationActionTakenCallback: " + ex);
            reject(ex);
        }
    });
}
function _processPendingNotifications() {
    const app = UIApplication.sharedApplication;
    if (!app) {
        Application.on("launch", () => _processPendingNotifications());
        return;
    }
    if (_receivedNotificationCallback) {
        for (let p in _pendingNotifications) {
            _receivedNotificationCallback(_pendingNotifications[p]);
        }
        _pendingNotifications = [];
        if (app.applicationState === 0 && _autoClearBadge) {
            app.applicationIconBadgeNumber = 0;
        }
    }
}
function _processPendingActionTakenNotifications() {
    const app = UIApplication.sharedApplication;
    if (!app) {
        Application.on("launch", () => _processPendingNotifications());
        return;
    }
    if (_notificationActionTakenCallback) {
        for (let p in _pendingActionTakenNotifications) {
            _notificationActionTakenCallback(_pendingActionTakenNotifications[p].actionIdentifier, _pendingActionTakenNotifications[p].userInfoJSON, _pendingActionTakenNotifications[p].inputText);
        }
        _pendingActionTakenNotifications = [];
        if (app.applicationState === 0 && _autoClearBadge) {
            app.applicationIconBadgeNumber = 0;
        }
    }
}
function _addObserver(eventName, callback) {
    return NSNotificationCenter.defaultCenter.addObserverForNameObjectQueueUsingBlock(eventName, null, NSOperationQueue.mainQueue, callback);
}
class FirebaseNotificationDelegateObserverImpl {
    constructor(callback) {
        this.observerUniqueKey = "firebase-messaging";
        this.callback = callback;
    }
    userNotificationCenterWillPresentNotificationWithCompletionHandler(center, notification, completionHandler, next) {
        const userInfo = notification.request.content.userInfo;
        const userInfoJSON = firebaseUtils.toJsObject(userInfo);
        if (!(notification.request.trigger instanceof UNPushNotificationTrigger)) {
            next();
            return;
        }
        if (_showNotificationsWhenInForeground ||
            userInfoJSON["gcm.notification.showWhenInForeground"] === "true" ||
            userInfoJSON["showWhenInForeground"] === true ||
            (userInfoJSON.aps && userInfoJSON.aps.showWhenInForeground === true)) {
            completionHandler(4 | 2 | 1);
        }
        else {
            completionHandler(0);
        }
        this.callback(notification);
    }
    userNotificationCenterDidReceiveNotificationResponseWithCompletionHandler(center, response, completionHandler, next) {
        if (!(response.notification.request.trigger instanceof UNPushNotificationTrigger)) {
            next();
            return;
        }
        if (response && response.actionIdentifier === UNNotificationDismissActionIdentifier) {
            completionHandler();
            return;
        }
        this.callback(response.notification, response.actionIdentifier, response.userText);
        completionHandler();
    }
}
var FIRMessagingDelegateImpl = /** @class */ (function (_super) {
    __extends(FIRMessagingDelegateImpl, _super);
    function FIRMessagingDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FIRMessagingDelegateImpl.new = function () {
        if (FIRMessagingDelegateImpl.ObjCProtocols.length === 0 && typeof (FIRMessagingDelegate) !== "undefined") {
            FIRMessagingDelegateImpl.ObjCProtocols.push(FIRMessagingDelegate);
        }
        return _super.new.call(this);
    };
    FIRMessagingDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    FIRMessagingDelegateImpl.prototype.messagingDidReceiveMessage = function (messaging, remoteMessage) {
        this.callback(remoteMessage.appData);
    };
    FIRMessagingDelegateImpl.prototype.messagingDidReceiveRegistrationToken = function (messaging, fcmToken) {
        onTokenRefreshNotification(fcmToken);
    };
    FIRMessagingDelegateImpl.ObjCProtocols = [];
    return FIRMessagingDelegateImpl;
}(NSObject));
//# sourceMappingURL=messaging.ios.js.map