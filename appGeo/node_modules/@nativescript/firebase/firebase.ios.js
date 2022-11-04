import { Application, Device } from "@nativescript/core";
import { DocumentSnapshot as DocumentSnapshotBase, FieldValue, firebase, GeoPoint, isDocumentReference } from "./firebase-common";
import * as firebaseFunctions from "./functions/functions";
import * as firebaseMessaging from "./messaging/messaging";
import { firebaseUtils } from "./utils";
import { getNonce, Sha256 } from "./utils/nonce-util-ios";
export var QueryOrderByType;
(function (QueryOrderByType) {
    QueryOrderByType[QueryOrderByType["KEY"] = 0] = "KEY";
    QueryOrderByType[QueryOrderByType["VALUE"] = 1] = "VALUE";
    QueryOrderByType[QueryOrderByType["CHILD"] = 2] = "CHILD";
    QueryOrderByType[QueryOrderByType["PRIORITY"] = 3] = "PRIORITY";
})(QueryOrderByType || (QueryOrderByType = {}));
export var QueryRangeType;
(function (QueryRangeType) {
    QueryRangeType[QueryRangeType["START_AT"] = 0] = "START_AT";
    QueryRangeType[QueryRangeType["END_AT"] = 1] = "END_AT";
    QueryRangeType[QueryRangeType["EQUAL_TO"] = 2] = "EQUAL_TO";
})(QueryRangeType || (QueryRangeType = {}));
export var QueryLimitType;
(function (QueryLimitType) {
    QueryLimitType[QueryLimitType["FIRST"] = 0] = "FIRST";
    QueryLimitType[QueryLimitType["LAST"] = 1] = "LAST";
})(QueryLimitType || (QueryLimitType = {}));
firebase._gIDAuthentication = null;
firebase._cachedDynamicLink = null;
firebase._configured = false;
firebase._currentNonce = null;
const useExternalPushProvider = NSBundle.mainBundle.infoDictionary.objectForKey("UseExternalPushProvider") === true;
let initializeArguments;
class DocumentSnapshot extends DocumentSnapshotBase {
    constructor(snapshot) {
        super(snapshot.documentID, snapshot.exists, firebaseUtils.toJsObject(snapshot.data()), firebase.firestore._getDocumentReference(snapshot.reference));
        this.snapshot = snapshot;
        this.metadata = {
            fromCache: this.snapshot.metadata.fromCache,
            hasPendingWrites: this.snapshot.metadata.pendingWrites
        };
        this.ios = snapshot;
    }
}
firebase.authStateListener = null;
firebase.addOnMessageReceivedCallback = firebaseMessaging.addOnMessageReceivedCallback;
firebase.addOnPushTokenReceivedCallback = firebaseMessaging.addOnPushTokenReceivedCallback;
firebase.registerForPushNotifications = firebaseMessaging.registerForPushNotifications;
firebase.unregisterForPushNotifications = firebaseMessaging.unregisterForPushNotifications;
firebase.getCurrentPushToken = firebaseMessaging.getCurrentPushToken;
firebase.registerForInteractivePush = firebaseMessaging.registerForInteractivePush;
firebase.subscribeToTopic = firebaseMessaging.subscribeToTopic;
firebase.unsubscribeFromTopic = firebaseMessaging.unsubscribeFromTopic;
firebase.areNotificationsEnabled = firebaseMessaging.areNotificationsEnabled;
firebase.functions = firebaseFunctions;
NSNotificationCenter.defaultCenter.addObserverForNameObjectQueueUsingBlock(UIApplicationDidFinishLaunchingNotification, null, NSOperationQueue.mainQueue, appNotification => {
    if (!firebase._configured) {
        firebase._configured = true;
        if (typeof (FIRApp) !== "undefined") {
            FIRApp.configure();
        }
    }
});
firebase.addAppDelegateMethods = appDelegate => {
    if (typeof (FIRMessaging) !== "undefined" || useExternalPushProvider || typeof (FBSDKApplicationDelegate) !== "undefined") {
        appDelegate.prototype.applicationDidFinishLaunchingWithOptions = (application, launchOptions) => {
            if (launchOptions) {
                const remoteNotification = launchOptions.objectForKey(UIApplicationLaunchOptionsRemoteNotificationKey);
                if (remoteNotification) {
                    firebaseMessaging.handleRemoteNotification(application, remoteNotification);
                }
            }
            if (typeof (FBSDKApplicationDelegate) !== "undefined") {
                FBSDKApplicationDelegate.sharedInstance.applicationDidFinishLaunchingWithOptions(application, launchOptions);
            }
            return true;
        };
    }
    if (typeof (FBSDKApplicationDelegate) !== "undefined" || typeof (GIDSignIn) !== "undefined" || typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = (application, url, sourceApplication, annotation) => {
            let result = false;
            if (typeof (FBSDKApplicationDelegate) !== "undefined") {
                result = FBSDKApplicationDelegate.sharedInstance.applicationOpenURLSourceApplicationAnnotation(application, url, sourceApplication, annotation);
            }
            if (typeof (GIDSignIn) !== "undefined") {
                result = result || GIDSignIn.sharedInstance().handleURL(url);
            }
            if (typeof (FIRDynamicLink) !== "undefined") {
                const dynamicLink = FIRDynamicLinks.dynamicLinks().dynamicLinkFromCustomSchemeURL(url);
                if (dynamicLink) {
                    console.log("Dynamic link from " + sourceApplication + ", URL: " + dynamicLink.url.absoluteString);
                    firebase._cachedDynamicLink = {
                        url: dynamicLink.url.absoluteString,
                        minimumAppVersion: dynamicLink.minimumAppVersion
                    };
                    result = true;
                }
            }
            return result;
        };
    }
    if (typeof (FBSDKApplicationDelegate) !== "undefined" || typeof (GIDSignIn) !== "undefined" || typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationOpenURLOptions = (application, url, options) => {
            let result = false;
            if (typeof (FBSDKApplicationDelegate) !== "undefined") {
                result = FBSDKApplicationDelegate.sharedInstance.applicationOpenURLSourceApplicationAnnotation(application, url, options.valueForKey(UIApplicationOpenURLOptionsSourceApplicationKey), options.valueForKey(UIApplicationOpenURLOptionsAnnotationKey));
            }
            if (typeof (GIDSignIn) !== "undefined") {
                result = result || GIDSignIn.sharedInstance().handleURL(url);
            }
            if (typeof (FIRDynamicLink) !== "undefined") {
                const dynamicLinks = FIRDynamicLinks.dynamicLinks();
                const dynamicLink = dynamicLinks.dynamicLinkFromCustomSchemeURL(url);
                if (dynamicLink && dynamicLink.url !== null) {
                    if (firebase._dynamicLinkCallback) {
                        firebase._dynamicLinkCallback({
                            url: dynamicLink.url.absoluteString,
                            minimumAppVersion: dynamicLink.minimumAppVersion
                        });
                    }
                    else {
                        firebase._cachedDynamicLink = {
                            url: dynamicLink.url.absoluteString,
                            minimumAppVersion: dynamicLink.minimumAppVersion
                        };
                    }
                    result = true;
                }
            }
            return result;
        };
    }
    if (typeof (FIRDynamicLink) !== "undefined") {
        appDelegate.prototype.applicationContinueUserActivityRestorationHandler = (application, userActivity, restorationHandler) => {
            let result = false;
            if (userActivity.webpageURL) {
                firebase.fAuth = (typeof (FIRAuth) !== "undefined") ? FIRAuth.auth() : undefined;
                if (firebase.fAuth && firebase.fAuth.isSignInWithEmailLink(userActivity.webpageURL.absoluteString)) {
                    const rememberedEmail = firebase.getRememberedEmailForEmailLinkLogin();
                    if (rememberedEmail !== undefined) {
                        if (firebase.fAuth.currentUser) {
                            const onCompletionLink = (result, error) => {
                                if (error) {
                                    firebase.fAuth.signInWithEmailLinkCompletion(rememberedEmail, userActivity.webpageURL.absoluteString, (authData, error) => {
                                        if (!error) {
                                            firebase.notifyAuthStateListeners({
                                                loggedIn: true,
                                                user: toLoginResult(authData.user)
                                            });
                                        }
                                        firebase.fAuth = null;
                                    });
                                }
                                else {
                                    firebase.notifyAuthStateListeners({
                                        loggedIn: true,
                                        user: toLoginResult(result.user)
                                    });
                                    firebase.fAuth = null;
                                }
                            };
                            const fIRAuthCredential = FIREmailAuthProvider.credentialWithEmailLink(rememberedEmail, userActivity.webpageURL.absoluteString);
                            firebase.fAuth.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                        }
                        else {
                            firebase.fAuth.signInWithEmailLinkCompletion(rememberedEmail, userActivity.webpageURL.absoluteString, (authData, error) => {
                                if (error) {
                                    console.log(error.localizedDescription);
                                }
                                else {
                                    firebase.notifyAuthStateListeners({
                                        loggedIn: true,
                                        user: toLoginResult(authData.user)
                                    });
                                }
                                firebase.fAuth = null;
                            });
                        }
                    }
                    result = true;
                }
                else {
                    result = FIRDynamicLinks.dynamicLinks().handleUniversalLinkCompletion(userActivity.webpageURL, (dynamicLink, error) => {
                        if (dynamicLink !== null && dynamicLink.url !== null) {
                            if (firebase._dynamicLinkCallback) {
                                firebase._dynamicLinkCallback({
                                    url: dynamicLink.url.absoluteString,
                                    minimumAppVersion: dynamicLink.minimumAppVersion
                                });
                            }
                            else {
                                firebase._cachedDynamicLink = {
                                    url: dynamicLink.url.absoluteString,
                                    minimumAppVersion: dynamicLink.minimumAppVersion
                                };
                            }
                        }
                    });
                }
            }
            return result;
        };
    }
    if (typeof (FIRMessaging) !== "undefined" || useExternalPushProvider) {
        firebaseMessaging.addBackgroundRemoteNotificationHandler(appDelegate);
    }
};
firebase.fetchSignInMethodsForEmail = email => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (email) !== "string") {
                reject("A parameter representing an email address is required.");
                return;
            }
            FIRAuth.auth().fetchSignInMethodsForEmailCompletion(email, (methodsNSArray, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(firebaseUtils.toJsObject(methodsNSArray));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.fetchSignInMethodsForEmail: " + ex);
            reject(ex);
        }
    });
};
firebase.addOnDynamicLinkReceivedCallback = callback => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (FIRDynamicLink) === "undefined") {
                reject("Set 'dynamic_links' to 'true' in firebase.nativescript.json and remove the platforms/ios folder");
                return;
            }
            firebase._dynamicLinkCallback = callback;
            if (firebase._cachedDynamicLink !== null) {
                callback(firebase._cachedDynamicLink);
                firebase._cachedDynamicLink = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.addOnDynamicLinkReceivedCallback: " + ex);
            reject(ex);
        }
    });
};
if (typeof (FIRMessaging) !== "undefined" || useExternalPushProvider) {
    firebaseMessaging.prepAppDelegate();
}
function getAppDelegate() {
    if (Application.ios.delegate === undefined) {
        var UIApplicationDelegateImpl = /** @class */ (function (_super) {
    __extends(UIApplicationDelegateImpl, _super);
    function UIApplicationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIApplicationDelegateImpl = __decorate([
        ObjCClass(UIApplicationDelegate)
    ], UIApplicationDelegateImpl);
    return UIApplicationDelegateImpl;
}(UIResponder));
        Application.ios.delegate = UIApplicationDelegateImpl;
    }
    return Application.ios.delegate;
}
firebase.addAppDelegateMethods(getAppDelegate());
firebase.getCallbackData = (type, snapshot) => {
    return {
        type: type,
        key: snapshot.key,
        value: firebaseUtils.toJsObject(snapshot.value)
    };
};
firebase.init = arg => {
    return new Promise((resolve, reject) => {
        if (firebase.initialized) {
            reject("Firebase already initialized");
            return;
        }
        firebase.initialized = true;
        try {
            try {
                if (typeof (FIRServerValue) !== "undefined") {
                    firebase.ServerValue = {
                        TIMESTAMP: FIRServerValue.timestamp()
                    };
                }
            }
            catch (ignore) {
            }
            arg = arg || {};
            initializeArguments = arg;
            if (FIROptions && FIROptions.defaultOptions() !== null) {
                FIROptions.defaultOptions().deepLinkURLScheme = NSBundle.mainBundle.bundleIdentifier;
            }
            if (typeof (FIRAnalytics) !== "undefined" && FIRAnalytics.setAnalyticsCollectionEnabled) {
                FIRAnalytics.setAnalyticsCollectionEnabled(arg.analyticsCollectionEnabled !== false);
            }
            if (!firebase._configured) {
                firebase._configured = true;
                if (typeof (FIRApp) !== "undefined") {
                    FIRApp.configure();
                }
            }
            if (typeof (FIRDatabase) !== "undefined") {
                if (arg.persist) {
                    FIRDatabase.database().persistenceEnabled = true;
                }
            }
            if (typeof (FIRFirestore) !== "undefined") {
                if (arg.persist === false) {
                    const fIRFirestoreSettings = FIRFirestoreSettings.new();
                    fIRFirestoreSettings.persistenceEnabled = false;
                    FIRFirestore.firestore().settings = fIRFirestoreSettings;
                }
            }
            if (typeof (FIRAuth) !== "undefined") {
                if (arg.iOSEmulatorFlush) {
                    try {
                        FIRAuth.auth().signOut();
                    }
                    catch (signOutErr) {
                        console.log("Sign out of Firebase error: " + signOutErr);
                    }
                }
                if (arg.onAuthStateChanged) {
                    firebase.authStateListener = (auth, user) => {
                        arg.onAuthStateChanged({
                            loggedIn: user !== null,
                            user: toLoginResult(user)
                        });
                    };
                    FIRAuth.auth().addAuthStateDidChangeListener(firebase.authStateListener);
                }
                if (!firebase.authStateListener) {
                    firebase.authStateListener = (auth, user) => {
                        firebase.notifyAuthStateListeners({
                            loggedIn: user !== null,
                            user: toLoginResult(user)
                        });
                    };
                    FIRAuth.auth().addAuthStateDidChangeListener(firebase.authStateListener);
                }
            }
            if (arg.onDynamicLinkCallback !== undefined) {
                firebase.addOnDynamicLinkReceivedCallback(arg.onDynamicLinkCallback);
            }
            if (typeof (FBSDKAppEvents) !== "undefined") {
                FBSDKAppEvents.activateApp();
            }
            if (typeof (FIRMessaging) !== "undefined") {
                firebaseMessaging.initFirebaseMessaging(arg);
            }
            if (arg.storageBucket) {
                if (typeof (FIRStorage) === "undefined") {
                    reject("Uncomment Storage in the plugin's Podfile first");
                    return;
                }
                firebase.storageBucket = FIRStorage.storage().referenceForURL(arg.storageBucket);
            }
            resolve(typeof (FIRDatabase) !== "undefined" ? FIRDatabase.database().reference() : undefined);
        }
        catch (ex) {
            console.log("Error in firebase.init: " + ex);
            reject(ex);
        }
    });
};
firebase.getRemoteConfig = arg => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (FIRRemoteConfig) === "undefined") {
                reject("Uncomment RemoteConfig in the plugin's Podfile first");
                return;
            }
            if (arg.properties === undefined) {
                reject("Argument 'properties' is missing");
                return;
            }
            const firebaseRemoteConfig = FIRRemoteConfig.remoteConfig();
            firebaseRemoteConfig.configSettings = new FIRRemoteConfigSettings({ developerModeEnabled: arg.developerMode || false });
            const dic = NSMutableDictionary.new();
            for (let p in arg.properties) {
                const prop = arg.properties[p];
                if (prop.default !== undefined) {
                    dic.setObjectForKey(prop.default, prop.key);
                }
            }
            firebaseRemoteConfig.setDefaults(dic);
            const onCompletion = (remoteConfigFetchStatus, error) => {
                if (remoteConfigFetchStatus === 1 ||
                    remoteConfigFetchStatus === 3) {
                    const activated = firebaseRemoteConfig.activateFetched();
                    const result = {
                        lastFetch: firebaseRemoteConfig.lastFetchTime,
                        throttled: remoteConfigFetchStatus === 3,
                        properties: {}
                    };
                    for (let p in arg.properties) {
                        const prop = arg.properties[p];
                        const key = prop.key;
                        const value = firebaseRemoteConfig.configValueForKey(key).stringValue;
                        result.properties[key] = firebase.strongTypeify(value);
                    }
                    resolve(result);
                }
                else {
                    reject(error ? error.localizedDescription : "Unknown error, fetch status: " + remoteConfigFetchStatus);
                }
            };
            const expirationDuration = arg.cacheExpirationSeconds || 43200;
            firebaseRemoteConfig.fetchWithExpirationDurationCompletionHandler(expirationDuration, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.getRemoteConfig: " + ex);
            reject(ex);
        }
    });
};
firebase.getCurrentUser = arg => {
    return new Promise((resolve, reject) => {
        try {
            const fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            const user = fAuth.currentUser;
            if (user) {
                resolve(toLoginResult(user));
            }
            else {
                reject();
            }
        }
        catch (ex) {
            console.log("Error in firebase.getCurrentUser: " + ex);
            reject(ex);
        }
    });
};
firebase.sendEmailVerification = (actionCodeSettings) => {
    return new Promise((resolve, reject) => {
        try {
            const fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            const user = fAuth.currentUser;
            if (user) {
                const onCompletion = error => {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve(true);
                    }
                };
                if (actionCodeSettings) {
                    const firActionCodeSettings = FIRActionCodeSettings.new();
                    if (actionCodeSettings.handleCodeInApp !== undefined) {
                        firActionCodeSettings.handleCodeInApp = actionCodeSettings.handleCodeInApp;
                    }
                    if (actionCodeSettings.url) {
                        firActionCodeSettings.URL = NSURL.URLWithString(actionCodeSettings.url);
                    }
                    if (actionCodeSettings.iOS) {
                        if (actionCodeSettings.iOS.bundleId) {
                            firActionCodeSettings.setIOSBundleID(actionCodeSettings.iOS.bundleId);
                        }
                        if (actionCodeSettings.iOS.dynamicLinkDomain) {
                            firActionCodeSettings.dynamicLinkDomain = actionCodeSettings.iOS.dynamicLinkDomain;
                        }
                    }
                    if (actionCodeSettings.android && actionCodeSettings.android.packageName) {
                        firActionCodeSettings.setAndroidPackageNameInstallIfNotAvailableMinimumVersion(actionCodeSettings.android.packageName, actionCodeSettings.android.installApp, actionCodeSettings.android.minimumVersion || null);
                    }
                    user.sendEmailVerificationWithActionCodeSettingsCompletion(firActionCodeSettings, onCompletion);
                }
                else {
                    user.sendEmailVerificationWithCompletion(onCompletion);
                }
            }
            else {
                reject("Log in first");
            }
        }
        catch (ex) {
            console.log("Error in firebase.sendEmailVerification: " + ex);
            reject(ex);
        }
    });
};
firebase.logout = arg => {
    return new Promise((resolve, reject) => {
        try {
            FIRAuth.auth().signOut();
            firebase.currentAdditionalUserInfo = null;
            if (typeof (GIDSignIn) !== "undefined") {
                GIDSignIn.sharedInstance().disconnect();
            }
            if (typeof (FBSDKLoginManager) !== "undefined") {
                FBSDKLoginManager.alloc().logOut();
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.logout: " + ex);
            reject(ex);
        }
    });
};
firebase.unlink = providerId => {
    return new Promise((resolve, reject) => {
        try {
            const user = FIRAuth.auth().currentUser;
            if (!user) {
                reject("Not logged in");
                return;
            }
            user.unlinkFromProviderCompletion(providerId, (user, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(user);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.logout: " + ex);
            reject(ex);
        }
    });
};
function toLoginResult(user, additionalUserInfo) {
    if (!user) {
        return null;
    }
    if (additionalUserInfo) {
        firebase.currentAdditionalUserInfo = additionalUserInfo;
    }
    const providers = [];
    if (user.providerData) {
        for (let i = 0, l = user.providerData.count; i < l; i++) {
            const firUserInfo = user.providerData.objectAtIndex(i);
            const pid = firUserInfo.valueForKey("providerID");
            if (pid === "facebook.com" && typeof (FBSDKAccessToken) !== "undefined") {
                providers.push({ id: pid, token: FBSDKAccessToken.currentAccessToken ? FBSDKAccessToken.currentAccessToken.tokenString : null });
            }
            else if (pid === "google.com" && typeof (GIDSignIn) !== "undefined" && GIDSignIn.sharedInstance() && GIDSignIn.sharedInstance().currentUser) {
                const gidCurrentIdToken = GIDSignIn.sharedInstance().currentUser.authentication.idToken;
                providers.push({ id: pid, token: gidCurrentIdToken });
            }
            else if (pid === "apple.com") {
            }
            else {
                providers.push({ id: pid });
            }
        }
    }
    const loginResult = {
        uid: user.uid,
        anonymous: user.anonymous,
        isAnonymous: user.anonymous,
        providers: providers,
        photoURL: user.photoURL ? user.photoURL.absoluteString : null,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        refreshToken: user.refreshToken,
        metadata: {
            creationTimestamp: user.metadata.creationDate,
            lastSignInTimestamp: user.metadata.lastSignInDate
        },
        getIdToken: (forceRefresh) => new Promise((resolve, reject) => {
            firebase.getAuthToken({ forceRefresh })
                .then((result) => resolve(result.token))
                .catch(reject);
        }),
        getIdTokenResult: (forceRefresh) => new Promise((resolve, reject) => {
            firebase.getAuthToken({ forceRefresh })
                .then((result) => resolve(result))
                .catch(reject);
        }),
        sendEmailVerification: (actionCodeSettings) => firebase.sendEmailVerification(actionCodeSettings)
    };
    if (firebase.currentAdditionalUserInfo) {
        loginResult.additionalUserInfo = {
            providerId: firebase.currentAdditionalUserInfo.providerID,
            username: firebase.currentAdditionalUserInfo.username,
            isNewUser: firebase.currentAdditionalUserInfo.newUser,
            profile: firebaseUtils.toJsObject(firebase.currentAdditionalUserInfo.profile)
        };
    }
    return loginResult;
}
firebase.getAuthToken = (arg) => {
    return new Promise((resolve, reject) => {
        try {
            const fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            const user = fAuth.currentUser;
            if (user) {
                user.getIDTokenResultForcingRefreshCompletion(arg.forceRefresh, (result, error) => {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve({
                            token: result.token,
                            claims: firebaseUtils.toJsObject(result.claims),
                            signInProvider: result.signInProvider,
                            expirationTime: firebaseUtils.toJsObject(result.expirationDate),
                            issuedAtTime: firebaseUtils.toJsObject(result.issuedAtDate),
                            authTime: firebaseUtils.toJsObject(result.authDate)
                        });
                    }
                });
            }
            else {
                reject("Log in first");
            }
        }
        catch (ex) {
            console.log("Error in firebase.getAuthToken: " + ex);
            reject(ex);
        }
    });
};
firebase.login = arg => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletionWithAuthResult = (authResult, error) => {
                if (error) {
                    if (typeof (GIDSignIn) !== "undefined") {
                        GIDSignIn.sharedInstance().disconnect();
                    }
                    reject(error.localizedDescription);
                }
                else {
                    resolve(toLoginResult(authResult && authResult.user, authResult && authResult.additionalUserInfo));
                    firebase.notifyAuthStateListeners({
                        loggedIn: true,
                        user: toLoginResult(authResult.user)
                    });
                }
                firebase.fAuth = null;
            };
            firebase.fAuth = FIRAuth.auth();
            if (firebase.fAuth === null) {
                reject("Run init() first!");
                return;
            }
            firebase.moveLoginOptionsToObjects(arg);
            if (arg.type === firebase.LoginType.ANONYMOUS) {
                firebase.fAuth.signInAnonymouslyWithCompletion(onCompletionWithAuthResult);
            }
            else if (arg.type === firebase.LoginType.PASSWORD) {
                if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
                    reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
                    return;
                }
                const fIRAuthCredential = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);
                if (firebase.fAuth.currentUser) {
                    const onCompletionLink = (authData, error) => {
                        if (error) {
                            log("--- linking error: " + error.localizedDescription);
                            firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                        }
                        else {
                            onCompletionWithAuthResult(authData, error);
                        }
                        firebase.fAuth = null;
                    };
                    firebase.fAuth.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                }
                else {
                    firebase.fAuth.signInWithEmailPasswordCompletion(arg.passwordOptions.email, arg.passwordOptions.password, onCompletionWithAuthResult);
                }
            }
            else if (arg.type === firebase.LoginType.EMAIL_LINK) {
                if (!arg.emailLinkOptions || !arg.emailLinkOptions.email) {
                    reject("Auth type EMAIL_LINK requires an 'emailLinkOptions.email' argument");
                    return;
                }
                if (!arg.emailLinkOptions.url) {
                    reject("Auth type EMAIL_LINK requires an 'emailLinkOptions.url' argument");
                    return;
                }
                const firActionCodeSettings = FIRActionCodeSettings.new();
                firActionCodeSettings.URL = NSURL.URLWithString(arg.emailLinkOptions.url);
                firActionCodeSettings.handleCodeInApp = true;
                firActionCodeSettings.setIOSBundleID(arg.emailLinkOptions.iOS ? arg.emailLinkOptions.iOS.bundleId : NSBundle.mainBundle.bundleIdentifier);
                firActionCodeSettings.setAndroidPackageNameInstallIfNotAvailableMinimumVersion(arg.emailLinkOptions.android ? arg.emailLinkOptions.android.packageName : NSBundle.mainBundle.bundleIdentifier, arg.emailLinkOptions.android ? arg.emailLinkOptions.android.installApp || false : false, arg.emailLinkOptions.android ? arg.emailLinkOptions.android.minimumVersion || "1" : "1");
                firebase.fAuth.sendSignInLinkToEmailActionCodeSettingsCompletion(arg.emailLinkOptions.email, firActionCodeSettings, (error) => {
                    if (error) {
                        reject(error.localizedDescription);
                        return;
                    }
                    firebase.rememberEmailForEmailLinkLogin(arg.emailLinkOptions.email);
                    resolve();
                });
            }
            else if (arg.type === firebase.LoginType.PHONE) {
                if (!arg.phoneOptions || !arg.phoneOptions.phoneNumber) {
                    reject("Auth type PHONE requires a 'phoneOptions.phoneNumber' argument");
                    return;
                }
                FIRPhoneAuthProvider.provider().verifyPhoneNumberUIDelegateCompletion(arg.phoneOptions.phoneNumber, null, (verificationID, error) => {
                    if (error) {
                        reject(error.localizedDescription);
                        return;
                    }
                    firebase.requestPhoneAuthVerificationCode(userResponse => {
                        if (userResponse === undefined) {
                            reject("Prompt was canceled");
                            return;
                        }
                        const fIRAuthCredential = FIRPhoneAuthProvider.provider().credentialWithVerificationIDVerificationCode(verificationID, userResponse);
                        if (firebase.fAuth.currentUser) {
                            const onCompletionLink = (authData, error) => {
                                if (error) {
                                    firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                                }
                                else {
                                    onCompletionWithAuthResult(authData, error);
                                }
                                firebase.fAuth = null;
                            };
                            firebase.fAuth.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                        }
                        else {
                            firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                        }
                    }, arg.phoneOptions.verificationPrompt);
                });
            }
            else if (arg.type === firebase.LoginType.CUSTOM) {
                if (!arg.customOptions || (!arg.customOptions.token && !arg.customOptions.tokenProviderFn)) {
                    reject("Auth type CUSTOM requires a 'customOptions.token' or 'customOptions.tokenProviderFn' argument");
                    return;
                }
                if (arg.customOptions.token) {
                    firebase.fAuth.signInWithCustomTokenCompletion(arg.customOptions.token, onCompletionWithAuthResult);
                }
                else if (arg.customOptions.tokenProviderFn) {
                    arg.customOptions.tokenProviderFn()
                        .then(token => {
                        firebase.fAuth.signInWithCustomTokenCompletion(token, onCompletionWithAuthResult);
                    }, error => {
                        reject(error);
                    });
                }
            }
            else if (arg.type === firebase.LoginType.FACEBOOK) {
                if (typeof (FBSDKLoginManager) === "undefined") {
                    reject("Facebook SDK not installed - see Podfile");
                    return;
                }
                const onFacebookCompletion = (fbSDKLoginManagerLoginResult, error) => {
                    if (error) {
                        console.log("Facebook login error " + error);
                        reject(error.localizedDescription);
                    }
                    else if (fbSDKLoginManagerLoginResult.isCancelled) {
                        reject("login cancelled");
                    }
                    else {
                        const fIRAuthCredential = FIRFacebookAuthProvider.credentialWithAccessToken(FBSDKAccessToken.currentAccessToken.tokenString);
                        if (firebase.fAuth.currentUser) {
                            const onCompletionLink = (authData, error) => {
                                if (error) {
                                    log("--- linking error: " + error.localizedDescription);
                                    firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                                }
                                else {
                                    onCompletionWithAuthResult(authData);
                                }
                                firebase.fAuth = null;
                            };
                            firebase.fAuth.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                        }
                        else {
                            firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                        }
                    }
                };
                const fbSDKLoginManager = FBSDKLoginManager.new();
                let scopes = ["public_profile", "email"];
                if (arg.facebookOptions && arg.facebookOptions.scopes) {
                    scopes = arg.facebookOptions.scopes;
                }
                fbSDKLoginManager.logInWithPermissionsFromViewControllerHandler(scopes, null, onFacebookCompletion);
            }
            else if (arg.type === firebase.LoginType.APPLE) {
                if (parseInt(Device.osVersion) < 13) {
                    reject("Sign in with Apple requires iOS 13 or higher. You're running iOS " + Device.osVersion);
                    return;
                }
                firebase._currentNonce = getNonce(32);
                const sha256Nonce = Sha256(firebase._currentNonce);
                const appleIDProvider = ASAuthorizationAppleIDProvider.new();
                const appleIDRequest = appleIDProvider.createRequest();
                let scopes = [ASAuthorizationScopeFullName, ASAuthorizationScopeEmail];
                if (arg.appleOptions && arg.appleOptions.scopes) {
                    scopes = [];
                    arg.appleOptions.scopes.forEach(scope => {
                        if (scope === "name") {
                            scopes.push(ASAuthorizationScopeFullName);
                        }
                        else if (scope === "email") {
                            scopes.push(ASAuthorizationScopeEmail);
                        }
                        else {
                            console.log("Unknown scope: " + scope);
                        }
                    });
                }
                appleIDRequest.requestedScopes = scopes;
                appleIDRequest.nonce = sha256Nonce;
                const authorizationController = ASAuthorizationController.alloc().initWithAuthorizationRequests([appleIDRequest]);
                firebase.appleAuthDelegate = ASAuthorizationControllerDelegateImpl.createWithOwnerAndResolveReject(this, resolve, reject);
                authorizationController.delegate = firebase.appleAuthDelegate;
                authorizationController.presentationContextProvider = ASAuthorizationControllerPresentationContextProvidingImpl.createWithOwnerAndCallback(this);
                authorizationController.performRequests();
            }
            else if (arg.type === firebase.LoginType.GOOGLE) {
                if (typeof (GIDSignIn) === "undefined") {
                    reject("Google Sign In not installed - see Podfile");
                    return;
                }
                const sIn = GIDSignIn.sharedInstance();
                sIn.presentingViewController = arg.ios && arg.ios.controller ? arg.ios.controller : Application.ios.rootController;
                sIn.clientID = FIRApp.defaultApp().options.clientID;
                if (arg.googleOptions && arg.googleOptions.hostedDomain) {
                    sIn.hostedDomain = arg.googleOptions.hostedDomain;
                }
                if (arg.googleOptions && arg.googleOptions.scopes) {
                    sIn.scopes = arg.googleOptions.scopes;
                }
                firebase.googleSignInDelegate = GIDSignInDelegateImpl.new().initWithCallback((user, error) => {
                    if (error === null) {
                        firebase._gIDAuthentication = user.authentication;
                        const fIRAuthCredential = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase._gIDAuthentication.idToken, firebase._gIDAuthentication.accessToken);
                        if (firebase.fAuth.currentUser) {
                            const onCompletionLink = (user, error) => {
                                if (error) {
                                    firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                                }
                                else {
                                    onCompletionWithAuthResult(user);
                                }
                                firebase.fAuth = null;
                            };
                            firebase.fAuth.currentUser.linkWithCredentialCompletion(fIRAuthCredential, onCompletionLink);
                        }
                        else {
                            firebase.fAuth.signInWithCredentialCompletion(fIRAuthCredential, onCompletionWithAuthResult);
                        }
                    }
                    else {
                        reject(error.localizedDescription);
                    }
                    firebase.googleSignInDelegate = null;
                });
                sIn.delegate = firebase.googleSignInDelegate;
                sIn.signIn();
            }
            else {
                reject("Unsupported auth type: " + arg.type);
            }
        }
        catch (ex) {
            console.log("Error in firebase.login: " + ex);
            reject(ex);
        }
    });
};
firebase.reauthenticate = arg => {
    return new Promise((resolve, reject) => {
        try {
            const fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            const user = fAuth.currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            firebase.moveLoginOptionsToObjects(arg);
            let authCredential = null;
            if (arg.type === firebase.LoginType.PASSWORD) {
                if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
                    reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
                    return;
                }
                authCredential = FIREmailAuthProvider.credentialWithEmailPassword(arg.passwordOptions.email, arg.passwordOptions.password);
            }
            else if (arg.type === firebase.LoginType.GOOGLE) {
                if (!firebase._gIDAuthentication) {
                    reject("Not currently logged in with Google");
                    return;
                }
                authCredential = FIRGoogleAuthProvider.credentialWithIDTokenAccessToken(firebase._gIDAuthentication.idToken, firebase._gIDAuthentication.accessToken);
            }
            else if (arg.type === firebase.LoginType.FACEBOOK) {
                if (!FBSDKAccessToken.currentAccessToken) {
                    reject("Not currently logged in with Facebook");
                    return;
                }
                authCredential = FIRFacebookAuthProvider.credentialWithAccessToken(FBSDKAccessToken.currentAccessToken.tokenString);
            }
            if (authCredential === null) {
                reject("arg.type should be one of LoginType.PASSWORD | LoginType.GOOGLE | LoginType.FACEBOOK");
                return;
            }
            const onCompletion = (authResult, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    firebase.notifyAuthStateListeners({
                        loggedIn: true,
                        user: toLoginResult(authResult.user)
                    });
                    resolve(toLoginResult(authResult && authResult.user, authResult && authResult.additionalUserInfo));
                }
            };
            user.reauthenticateWithCredentialCompletion(authCredential, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.reauthenticate: " + ex);
            reject(ex);
        }
    });
};
firebase.reloadUser = () => {
    return new Promise((resolve, reject) => {
        try {
            const user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            user.reloadWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.reloadUser: " + ex);
            reject(ex);
        }
    });
};
firebase.sendPasswordResetEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            FIRAuth.auth().sendPasswordResetWithEmailCompletion(email, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.sendPasswordResetEmail: " + ex);
            reject(ex);
        }
    });
};
firebase.updateEmail = (newEmail) => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            const user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
            }
            else {
                user.updateEmailCompletion(newEmail, onCompletion);
            }
        }
        catch (ex) {
            console.log("Error in firebase.updateEmail: " + ex);
            reject(ex);
        }
    });
};
firebase.updatePassword = (newPassword) => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            const user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
            }
            else {
                user.updatePasswordCompletion(newPassword, onCompletion);
            }
        }
        catch (ex) {
            console.log("Error in firebase.updatePassword: " + ex);
            reject(ex);
        }
    });
};
firebase.createUser = arg => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = (authResult, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(toLoginResult(authResult.user, authResult.additionalUserInfo));
                }
            };
            if (!arg.email || !arg.password) {
                reject("Creating a user requires an email and password argument");
            }
            else {
                FIRAuth.auth().createUserWithEmailPasswordCompletion(arg.email, arg.password, onCompletion);
            }
        }
        catch (ex) {
            console.log("Error in firebase.createUser: " + ex);
            reject(ex);
        }
    });
};
firebase.deleteUser = arg => {
    return new Promise((resolve, reject) => {
        try {
            const user = FIRAuth.auth().currentUser;
            if (user === null) {
                reject("no current user");
                return;
            }
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            user.deleteWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.deleteUser: " + ex);
            reject(ex);
        }
    });
};
firebase.updateProfile = arg => {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = error => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            };
            const fAuth = FIRAuth.auth();
            if (fAuth === null) {
                reject("Run init() first!");
                return;
            }
            if (!arg.displayName && !arg.photoURL) {
                reject("Updating a profile requires a displayName and / or a photoURL argument");
            }
            else {
                const user = fAuth.currentUser;
                if (user) {
                    const changeRequest = user.profileChangeRequest();
                    changeRequest.displayName = arg.displayName;
                    changeRequest.photoURL = NSURL.URLWithString(arg.photoURL);
                    changeRequest.commitChangesWithCompletion(onCompletion);
                }
                else {
                    reject();
                }
            }
        }
        catch (ex) {
            console.log("Error in firebase.updateProfile: " + ex);
            reject(ex);
        }
    });
};
firebase._addObservers = (to, updateCallback) => {
    const listeners = [];
    listeners.push(to.observeEventTypeWithBlock(0, snapshot => {
        updateCallback(firebase.getCallbackData('ChildAdded', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(1, snapshot => {
        updateCallback(firebase.getCallbackData('ChildRemoved', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(2, snapshot => {
        updateCallback(firebase.getCallbackData('ChildChanged', snapshot));
    }));
    listeners.push(to.observeEventTypeWithBlock(3, snapshot => {
        updateCallback(firebase.getCallbackData('ChildMoved', snapshot));
    }));
    return listeners;
};
firebase.keepInSync = (path, switchOn) => {
    return new Promise((resolve, reject) => {
        try {
            const where = FIRDatabase.database().reference().child(path);
            where.keepSynced(switchOn);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.keepInSync: " + ex);
            reject(ex);
        }
    });
};
firebase.addChildEventListener = (updateCallback, path) => {
    return new Promise((resolve, reject) => {
        try {
            const where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().child(path);
            resolve({
                path: path,
                listeners: firebase._addObservers(where, updateCallback)
            });
        }
        catch (ex) {
            console.log("Error in firebase.addChildEventListener: " + ex);
            reject(ex);
        }
    });
};
firebase.addValueEventListener = (updateCallback, path) => {
    return new Promise((resolve, reject) => {
        try {
            const where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().child(path);
            const listener = where.observeEventTypeWithBlockWithCancelBlock(4, snapshot => {
                updateCallback(firebase.getCallbackData('ValueChanged', snapshot));
            }, firebaseError => {
                updateCallback({
                    error: firebaseError.localizedDescription
                });
            });
            resolve({
                path: path,
                listeners: [listener]
            });
        }
        catch (ex) {
            console.log("Error in firebase.addChildEventListener: " + ex);
            reject(ex);
        }
    });
};
firebase.getValue = path => {
    return new Promise((resolve, reject) => {
        try {
            const where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().child(path);
            where.observeSingleEventOfTypeWithBlockWithCancelBlock(4, snapshot => {
                resolve(firebase.getCallbackData('ValueChanged', snapshot));
            }, firebaseError => {
                reject(firebaseError.localizedDescription);
            });
        }
        catch (ex) {
            console.log("Error in firebase.getValue: " + ex);
            reject(ex);
        }
    });
};
firebase.removeEventListeners = (listeners, path) => {
    return new Promise((resolve, reject) => {
        try {
            const where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().child(path);
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                where.removeObserverWithHandle(listener);
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.removeEventListeners: " + ex);
            reject(ex);
        }
    });
};
firebase.push = (path, val) => {
    return new Promise((resolve, reject) => {
        try {
            const ref = FIRDatabase.database().reference().child(path).childByAutoId();
            ref.setValueWithCompletionBlock(val, (error, dbRef) => {
                error ? reject(error.localizedDescription) : resolve({ key: ref.key });
            });
        }
        catch (ex) {
            console.log("Error in firebase.push: " + ex);
            reject(ex);
        }
    });
};
firebase.setValue = (path, val) => {
    return new Promise((resolve, reject) => {
        try {
            FIRDatabase.database().reference().child(path).setValueWithCompletionBlock(val, (error, dbRef) => {
                error ? reject(error.localizedDescription) : resolve();
            });
        }
        catch (ex) {
            console.log("Error in firebase.setValue: " + ex);
            reject(ex);
        }
    });
};
firebase.update = (path, val) => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof val === "object") {
                FIRDatabase.database().reference().child(path).updateChildValuesWithCompletionBlock(val, (error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
            else {
                const lastPartOfPath = path.lastIndexOf("/");
                const pathPrefix = path.substring(0, lastPartOfPath);
                const pathSuffix = path.substring(lastPartOfPath + 1);
                const updateObject = '{"' + pathSuffix + '" : "' + val + '"}';
                FIRDatabase.database().reference().child(pathPrefix).updateChildValuesWithCompletionBlock(JSON.parse(updateObject), (error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.update: " + ex);
            reject(ex);
        }
    });
};
firebase.query = (updateCallback, path, options) => {
    return new Promise((resolve, reject) => {
        try {
            const where = path === undefined ? FIRDatabase.database().reference() : FIRDatabase.database().reference().child(path);
            let query;
            if (options.orderBy.type === firebase.QueryOrderByType.KEY) {
                query = where.queryOrderedByKey();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.VALUE) {
                query = where.queryOrderedByValue();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.PRIORITY) {
                query = where.queryOrderedByPriority();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.CHILD) {
                if (options.orderBy.value === undefined || options.orderBy.value === null) {
                    reject("When orderBy.type is 'child' you must set orderBy.value as well.");
                    return;
                }
                query = where.queryOrderedByChild(options.orderBy.value);
            }
            else {
                reject("Invalid orderBy.type, use constants like firebase.QueryOrderByType.VALUE");
                return;
            }
            if (options.range && options.range.type) {
                if (options.range.type === firebase.QueryRangeType.START_AT) {
                    query = query.queryStartingAtValue(options.range.value);
                }
                else if (options.range.type === firebase.QueryRangeType.END_AT) {
                    query = query.queryEndingAtValue(options.range.value);
                }
                else if (options.range.type === firebase.QueryRangeType.EQUAL_TO) {
                    query = query.queryEqualToValue(options.range.value);
                }
                else {
                    reject("Invalid range.type, use constants like firebase.QueryRangeType.START_AT");
                    return;
                }
            }
            if (options.ranges) {
                for (let i = 0; i < options.ranges.length; i++) {
                    const range = options.ranges[i];
                    if (range.value === undefined || range.value === null) {
                        reject("Please set ranges[" + i + "].value");
                        return;
                    }
                    if (range.type === firebase.QueryRangeType.START_AT) {
                        query = query.queryStartingAtValue(range.value);
                    }
                    else if (range.type === firebase.QueryRangeType.END_AT) {
                        query = query.queryEndingAtValue(range.value);
                    }
                    else if (range.type === firebase.QueryRangeType.EQUAL_TO) {
                        query = query.queryEqualToValue(range.value);
                    }
                    else {
                        reject("Invalid ranges[" + i + "].type, use constants like firebase.QueryRangeType.START_AT");
                        return;
                    }
                }
            }
            if (options.limit && options.limit.type) {
                if (options.limit.value === undefined || options.limit.value === null) {
                    reject("Please set limit.value");
                    return;
                }
                if (options.limit.type === firebase.QueryLimitType.FIRST) {
                    query = query.queryLimitedToFirst(options.limit.value);
                }
                else if (options.limit.type === firebase.QueryLimitType.LAST) {
                    query = query.queryLimitedToLast(options.limit.value);
                }
                else {
                    reject("Invalid limit.type, use constants like firebase.queryOptions.limitType.FIRST");
                    return;
                }
            }
            if (options.singleEvent) {
                query.observeSingleEventOfTypeWithBlock(4, snapshot => {
                    const result = {
                        type: "ValueChanged",
                        key: snapshot.key,
                        value: {},
                        children: []
                    };
                    for (let i = 0; i < snapshot.children.allObjects.count; i++) {
                        const snap = snapshot.children.allObjects.objectAtIndex(i);
                        const val = firebaseUtils.toJsObject(snap.value);
                        result.value[snap.key] = val;
                        result.children.push(val);
                    }
                    if (updateCallback)
                        updateCallback(result);
                    resolve(result);
                });
            }
            else {
                resolve({
                    path: path,
                    listeners: firebase._addObservers(query, updateCallback)
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.query: " + ex);
            reject(ex);
        }
    });
};
firebase.remove = path => {
    return new Promise((resolve, reject) => {
        try {
            FIRDatabase.database().reference().child(path).setValueWithCompletionBlock(null, (error, dbRef) => {
                error ? reject(error.localizedDescription) : resolve();
            });
        }
        catch (ex) {
            console.log("Error in firebase.remove: " + ex);
            reject(ex);
        }
    });
};
class OnDisconnect {
    constructor(dbRef, path) {
        this.dbRef = dbRef;
        this.path = path;
    }
    cancel() {
        return new Promise((resolve, reject) => {
            try {
                this.dbRef.cancelDisconnectOperationsWithCompletionBlock((error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.cancel: " + ex);
                reject(ex);
            }
        });
    }
    remove() {
        return new Promise((resolve, reject) => {
            try {
                this.dbRef.onDisconnectRemoveValueWithCompletionBlock((error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.remove: " + ex);
                reject(ex);
            }
        });
    }
    set(value) {
        return new Promise((resolve, reject) => {
            try {
                this.dbRef.onDisconnectSetValueWithCompletionBlock(value, (error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.set: " + ex);
                reject(ex);
            }
        });
    }
    setWithPriority(value, priority) {
        return new Promise((resolve, reject) => {
            try {
                this.dbRef.onDisconnectSetValueAndPriorityWithCompletionBlock(value, priority, (error, dbRef) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.setWithPriority: " + ex);
                reject(ex);
            }
        });
    }
    update(values) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof values === "object") {
                    this.dbRef.onDisconnectUpdateChildValuesWithCompletionBlock(values, (error, dbRef) => {
                        error ? reject(error.localizedDescription) : resolve();
                    });
                }
                else {
                    const lastPartOfPath = this.path.lastIndexOf("/");
                    const pathPrefix = this.path.substring(0, lastPartOfPath);
                    const pathSuffix = this.path.substring(lastPartOfPath + 1);
                    const updateObject = '{"' + pathSuffix + '" : "' + values + '"}';
                    FIRDatabase.database().reference().child(pathPrefix).updateChildValuesWithCompletionBlock(JSON.parse(updateObject), (error, dbRef) => {
                        error ? reject(error.localizedDescription) : resolve();
                    });
                }
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.update: " + ex);
                reject(ex);
            }
        });
    }
}
firebase.onDisconnect = (path) => {
    if (!firebase.initialized) {
        console.error("Please run firebase.init() before firebase.onDisconnect()");
        throw new Error("FirebaseApp is not initialized. Make sure you run firebase.init() first");
    }
    const dbRef = FIRDatabase.database().reference().child(path);
    return new OnDisconnect(dbRef, path);
};
firebase.transaction = (path, transactionUpdate, onComplete) => {
    return new Promise((resolve, reject) => {
        if (!firebase.initialized) {
            console.error("Please run firebase.init() before firebase.transaction()");
            throw new Error("FirebaseApp is not initialized. Make sure you run firebase.init() first");
        }
        const dbRef = FIRDatabase.database().reference().child(path);
        dbRef.runTransactionBlockAndCompletionBlock((mutableData) => {
            const desiredValue = transactionUpdate(firebaseUtils.toJsObject(mutableData.value));
            if (desiredValue === undefined) {
                return FIRTransactionResult.successWithValue(mutableData);
            }
            else {
                mutableData.value = desiredValue;
                return FIRTransactionResult.successWithValue(mutableData);
            }
        }, (error, commited, snapshot) => {
            error !== null ? reject(error.localizedDescription) :
                resolve({ committed: commited, snapshot: nativeSnapshotToWebSnapshot(snapshot) });
        });
    });
};
function nativeSnapshotToWebSnapshot(snapshot) {
    function forEach(action) {
        const iterator = snapshot.children;
        let innerSnapshot;
        let datasnapshot;
        while (innerSnapshot = iterator.nextObject()) {
            datasnapshot = nativeSnapshotToWebSnapshot(innerSnapshot);
            if (action(datasnapshot)) {
                return true;
            }
        }
        return false;
    }
    return {
        key: snapshot.key,
        ref: snapshot.ref,
        child: (path) => nativeSnapshotToWebSnapshot(snapshot.childSnapshotForPath(path)),
        exists: () => snapshot.exists(),
        forEach: (func) => forEach(func),
        getPriority: () => firebaseUtils.toJsObject(snapshot.priority),
        hasChild: (path) => snapshot.hasChild(path),
        hasChildren: () => snapshot.hasChildren(),
        numChildren: () => snapshot.childrenCount,
        toJSON: () => snapshot.valueInExportFormat(),
        val: () => firebaseUtils.toJsObject(snapshot.value)
    };
}
firebase.enableLogging = (logging, persistent) => {
    FIRDatabase.setLoggingEnabled(logging);
};
const ensureFirestore = () => {
    if (typeof (FIRFirestore) === "undefined") {
        throw new Error("Make sure 'firestore' is enabled in 'firebase.nativescript.json', then clean the node_modules and platforms folders");
    }
    if (!firebase.initialized) {
        throw new Error("Please run firebase.init() before using Firestore");
    }
};
firebase.firestore.WriteBatch = (nativeWriteBatch) => {
    class FirestoreWriteBatch {
        constructor() {
            this.set = (documentRef, data, options) => {
                fixSpecialFields(data);
                nativeWriteBatch.setDataForDocumentMerge(data, documentRef.ios, options && options.merge);
                return this;
            };
            this.update = (documentRef, data) => {
                fixSpecialFields(data);
                nativeWriteBatch.updateDataForDocument(data, documentRef.ios);
                return this;
            };
            this.delete = (documentRef) => {
                nativeWriteBatch.deleteDocument(documentRef.ios);
                return this;
            };
        }
        commit() {
            return new Promise((resolve, reject) => {
                nativeWriteBatch.commitWithCompletion((error) => {
                    error ? reject(error.localizedDescription) : resolve();
                });
            });
        }
    }
    return new FirestoreWriteBatch();
};
firebase.firestore.batch = () => {
    ensureFirestore();
    return new firebase.firestore.WriteBatch(FIRFirestore.firestore().batch());
};
firebase.firestore.Transaction = (nativeTransaction) => {
    class FirestoreTransaction {
        constructor() {
            this.get = (documentRef) => {
                const docSnapshot = nativeTransaction.getDocumentError(documentRef.ios);
                return new DocumentSnapshot(docSnapshot);
            };
            this.set = (documentRef, data, options) => {
                fixSpecialFields(data);
                nativeTransaction.setDataForDocumentMerge(data, documentRef.ios, options && options.merge);
                return this;
            };
            this.update = (documentRef, data) => {
                fixSpecialFields(data);
                nativeTransaction.updateDataForDocument(data, documentRef.ios);
                return this;
            };
            this.delete = (documentRef) => {
                nativeTransaction.deleteDocument(documentRef.ios);
                return this;
            };
        }
    }
    return new FirestoreTransaction();
};
firebase.firestore.runTransaction = (updateFunction) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        FIRFirestore.firestore().runTransactionWithBlockCompletion((nativeTransaction, err) => {
            const tx = new firebase.firestore.Transaction(nativeTransaction);
            return updateFunction(tx);
        }, (result, error) => error ? reject(error.localizedDescription) : resolve());
    });
};
firebase.firestore.settings = (settings) => {
    if (typeof (FIRFirestore) !== "undefined") {
        try {
            const fIRFirestoreSettings = FIRFirestoreSettings.new();
            if (initializeArguments.persist !== undefined)
                fIRFirestoreSettings.persistenceEnabled = initializeArguments.persist;
            if (settings.ssl !== undefined)
                fIRFirestoreSettings.sslEnabled = settings.ssl;
            if (settings.host !== undefined)
                fIRFirestoreSettings.host = settings.host;
            FIRFirestore.firestore().settings = fIRFirestoreSettings;
        }
        catch (err) {
            console.log("Error in firebase.firestore.settings: " + err);
        }
    }
};
firebase.firestore.clearPersistence = () => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        FIRFirestore.firestore().clearPersistenceWithCompletion((error) => {
            error ? reject(error.localizedDescription) : resolve();
        });
    });
};
firebase.firestore.collection = (collectionPath) => {
    ensureFirestore();
    try {
        return firebase.firestore._getCollectionReference(FIRFirestore.firestore().collectionWithPath(collectionPath));
    }
    catch (ex) {
        console.log("Error in firebase.firestore.collection: " + ex);
        return null;
    }
};
firebase.firestore.collectionGroup = (id) => {
    ensureFirestore();
    try {
        return firebase.firestore._getCollectionGroupQuery(FIRFirestore.firestore().collectionGroupWithID(id));
    }
    catch (ex) {
        console.log("Error in firebase.firestore.collectionGroup: " + ex);
        return null;
    }
};
firebase.firestore.onDocumentSnapshot = (docRef, optionsOrCallback, callbackOrOnError, onError) => {
    let includeMetadataChanges = false;
    let onNextCallback;
    let onErrorCallback;
    if ((typeof optionsOrCallback) === "function") {
        onNextCallback = optionsOrCallback;
        onErrorCallback = callbackOrOnError;
    }
    else {
        onNextCallback = callbackOrOnError;
        onErrorCallback = onError;
    }
    if (optionsOrCallback.includeMetadataChanges === true) {
        includeMetadataChanges = true;
    }
    const listener = docRef.addSnapshotListenerWithIncludeMetadataChangesListener(includeMetadataChanges, (snapshot, error) => {
        if (error || !snapshot) {
            error && onErrorCallback && onErrorCallback(new Error(error.localizedDescription));
            return;
        }
        onNextCallback && onNextCallback(new DocumentSnapshot(snapshot));
    });
    if (listener.remove === undefined) {
        return () => {
            onNextCallback = () => {
            };
        };
    }
    else {
        return () => listener.remove();
    }
};
firebase.firestore.onCollectionSnapshot = (colRef, optionsOrCallback, callbackOrOnError, onError) => {
    let includeMetadataChanges = false;
    let onNextCallback;
    let onErrorCallback;
    if ((typeof optionsOrCallback) === "function") {
        onNextCallback = optionsOrCallback;
        onErrorCallback = callbackOrOnError;
    }
    else {
        onNextCallback = callbackOrOnError;
        onErrorCallback = onError;
    }
    if (optionsOrCallback.includeMetadataChanges === true) {
        includeMetadataChanges = true;
    }
    const listener = colRef.addSnapshotListenerWithIncludeMetadataChangesListener(includeMetadataChanges, (snapshot, error) => {
        if (error || !snapshot) {
            error && onErrorCallback && onErrorCallback(new Error(error.localizedDescription));
            return;
        }
        onNextCallback && onNextCallback(new QuerySnapshot(snapshot));
    });
    if (listener.remove === undefined) {
        return () => {
            onNextCallback = () => {
            };
        };
    }
    else {
        return () => listener.remove();
    }
};
firebase.firestore._getCollectionReference = (colRef) => {
    if (!colRef) {
        return null;
    }
    const collectionPath = colRef.path;
    return {
        id: colRef.collectionID,
        parent: firebase.firestore._getDocumentReference(colRef.parent),
        firestore: firebase.firestore,
        doc: (documentPath) => firebase.firestore.doc(collectionPath, documentPath),
        add: document => firebase.firestore.add(collectionPath, document),
        get: (options) => firebase.firestore.get(collectionPath, options),
        where: (fieldPath, opStr, value) => firebase.firestore.where(collectionPath, fieldPath, opStr, value),
        orderBy: (fieldPath, directionStr) => firebase.firestore.orderBy(collectionPath, fieldPath, directionStr, colRef),
        limit: (limit) => firebase.firestore.limit(collectionPath, limit, colRef),
        onSnapshot: (optionsOrCallback, callbackOrOnError, onError) => firebase.firestore.onCollectionSnapshot(colRef, optionsOrCallback, callbackOrOnError, onError),
        startAfter: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.startAfter(collectionPath, snapshotOrFieldValue, fieldValues, colRef),
        startAt: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.startAt(collectionPath, snapshotOrFieldValue, fieldValues, colRef),
        endAt: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.endAt(collectionPath, snapshotOrFieldValue, fieldValues, colRef),
        endBefore: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.endBefore(collectionPath, snapshotOrFieldValue, fieldValues, colRef)
    };
};
firebase.firestore._getCollectionGroupQuery = (query) => {
    if (!query) {
        return null;
    }
    return {
        where: (property, opStr, value) => firebase.firestore.where(undefined, property, opStr, value, query)
    };
};
firebase.firestore._getDocumentReference = (docRef) => {
    if (!docRef) {
        return null;
    }
    const collectionPath = docRef.parent.path;
    return {
        discriminator: "docRef",
        id: docRef.documentID,
        parent: firebase.firestore._getCollectionReference(docRef.parent),
        path: docRef.path,
        firestore: firebase.firestore,
        collection: cp => firebase.firestore.collection(`${collectionPath}/${docRef.documentID}/${cp}`),
        set: (data, options) => firebase.firestore.set(collectionPath, docRef.documentID, data, options),
        get: (options) => firebase.firestore.getDocument(collectionPath, docRef.documentID, options),
        update: (data) => firebase.firestore.update(collectionPath, docRef.documentID, data),
        delete: () => firebase.firestore.delete(collectionPath, docRef.documentID),
        onSnapshot: (optionsOrCallback, callbackOrOnError, onError) => firebase.firestore.onDocumentSnapshot(docRef, optionsOrCallback, callbackOrOnError, onError),
        ios: docRef
    };
};
firebase.firestore.doc = (collectionPath, documentPath) => {
    ensureFirestore();
    try {
        const fIRCollectionReference = FIRFirestore.firestore().collectionWithPath(collectionPath);
        const fIRDocumentReference = documentPath ? fIRCollectionReference.documentWithPath(documentPath) : fIRCollectionReference.documentWithAutoID();
        return firebase.firestore._getDocumentReference(fIRDocumentReference);
    }
    catch (ex) {
        console.log("Error in firebase.firestore.doc: " + ex);
        return null;
    }
};
firebase.firestore.docRef = (documentPath) => {
    ensureFirestore();
    return firebase.firestore._getDocumentReference(FIRFirestore.firestore().documentWithPath(documentPath));
};
firebase.firestore.add = (collectionPath, document) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            fixSpecialFields(document);
            const defaultFirestore = FIRFirestore.firestore();
            const fIRDocumentReference = defaultFirestore
                .collectionWithPath(collectionPath)
                .addDocumentWithDataCompletion(document, (error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(firebase.firestore._getDocumentReference(fIRDocumentReference));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.add: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore.set = (collectionPath, documentPath, document, options) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            fixSpecialFields(document);
            const docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            if (options && options.merge) {
                docRef.setDataMergeCompletion(document, true, (error) => {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                docRef.setDataCompletion(document, (error) => {
                    if (error) {
                        reject(error.localizedDescription);
                    }
                    else {
                        resolve();
                    }
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.firestore.set: " + ex);
            reject(ex);
        }
    });
};
function fixSpecialFields(item) {
    for (let k in item) {
        if (item.hasOwnProperty(k)) {
            item[k] = fixSpecialField(item[k]);
        }
    }
    return item;
}
function fixSpecialField(item) {
    if (item === null) {
        return null;
    }
    else if (item === "SERVER_TIMESTAMP") {
        return FIRFieldValue.fieldValueForServerTimestamp();
    }
    else if (item === "DELETE_FIELD") {
        return FIRFieldValue.fieldValueForDelete();
    }
    else if (item instanceof FieldValue) {
        const fieldValue = item;
        if (fieldValue.type === "ARRAY_UNION") {
            return FIRFieldValue.fieldValueForArrayUnion(Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value);
        }
        else if (fieldValue.type === "ARRAY_REMOVE") {
            return FIRFieldValue.fieldValueForArrayRemove(Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value);
        }
        else if (fieldValue.type === "INCREMENT") {
            const isInt = fieldValue.value % 1 === 0;
            if (isInt) {
                return FIRFieldValue.fieldValueForIntegerIncrement(fieldValue.value);
            }
            else {
                return FIRFieldValue.fieldValueForDoubleIncrement(fieldValue.value);
            }
        }
        else {
            console.log("You found a bug! Please report an issue at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues, mention fieldValue.type = '" + fieldValue.type + "'. Thanks!");
        }
    }
    else if (item instanceof GeoPoint) {
        const geo = item;
        return new FIRGeoPoint({
            latitude: geo.latitude,
            longitude: geo.longitude
        });
    }
    else if (isDocumentReference(item)) {
        return item.ios;
    }
    else if (typeof item === "object" && item.constructor === Object) {
        return fixSpecialFields(item);
    }
    else {
        return item;
    }
}
firebase.firestore.update = (collectionPath, documentPath, document) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            fixSpecialFields(document);
            const docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            docRef.updateDataCompletion(document, (error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.update: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore.delete = (collectionPath, documentPath) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            const docRef = FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath);
            docRef.deleteDocumentWithCompletion((error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.delete: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore.getCollection = (collectionPath, options) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            let source = 0;
            if (options && options.source) {
                if (options.source === "cache") {
                    source = 2;
                }
                else if (options.source === "server") {
                    source = 1;
                }
            }
            const defaultFirestore = FIRFirestore.firestore();
            defaultFirestore
                .collectionWithPath(collectionPath)
                .getDocumentsWithSourceCompletion(source, (snapshot, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(new QuerySnapshot(snapshot));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.getCollection: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore.get = (collectionPath, options) => {
    return firebase.firestore.getCollection(collectionPath, options);
};
firebase.firestore.getDocument = (collectionPath, documentPath, options) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            let source = 0;
            if (options && options.source) {
                if (options.source === "cache") {
                    source = 2;
                }
                else if (options.source === "server") {
                    source = 1;
                }
            }
            FIRFirestore.firestore()
                .collectionWithPath(collectionPath)
                .documentWithPath(documentPath)
                .getDocumentWithSourceCompletion(source, (snapshot, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(new DocumentSnapshot(snapshot));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.firestore.getDocument: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore._getQuery = (collectionPath, query) => {
    return {
        get: () => new Promise((resolve, reject) => {
            query.getDocumentsWithCompletion((snapshot, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(new QuerySnapshot(snapshot));
                }
            });
        }),
        where: (fp, os, v) => firebase.firestore.where(collectionPath, fp, os, v, query),
        orderBy: (fp, directionStr) => firebase.firestore.orderBy(collectionPath, fp, directionStr, query),
        limit: (limit) => firebase.firestore.limit(collectionPath, limit, query),
        onSnapshot: (optionsOrCallback, callbackOrOnError, onError) => firebase.firestore.onCollectionSnapshot(query, optionsOrCallback, callbackOrOnError, onError),
        startAfter: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.startAfter(collectionPath, snapshotOrFieldValue, fieldValues, query),
        startAt: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.startAt(collectionPath, snapshotOrFieldValue, fieldValues, query),
        endAt: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.endAt(collectionPath, snapshotOrFieldValue, fieldValues, query),
        endBefore: (snapshotOrFieldValue, ...fieldValues) => firebase.firestore.endBefore(collectionPath, snapshotOrFieldValue, fieldValues, query),
        firestore: firebase.firestore
    };
};
firebase.firestore.where = (collectionPath, fieldPath, opStr, value, query) => {
    ensureFirestore();
    try {
        query = query || FIRFirestore.firestore().collectionWithPath(collectionPath);
        value = fixSpecialField(value);
        if (opStr === "<") {
            query = query.queryWhereFieldIsLessThan(fieldPath, value);
        }
        else if (opStr === "<=") {
            query = query.queryWhereFieldIsLessThanOrEqualTo(fieldPath, value);
        }
        else if (opStr === "==") {
            query = query.queryWhereFieldIsEqualTo(fieldPath, value);
        }
        else if (opStr === ">=") {
            query = query.queryWhereFieldIsGreaterThanOrEqualTo(fieldPath, value);
        }
        else if (opStr === ">") {
            query = query.queryWhereFieldIsGreaterThan(fieldPath, value);
        }
        else if (opStr === "array-contains") {
            query = query.queryWhereFieldArrayContains(fieldPath, value);
        }
        else if (opStr === "array-contains-any") {
            query = query.queryWhereFieldArrayContainsAny(fieldPath, value);
        }
        else if (opStr === "in") {
            query = query.queryWhereFieldIn(fieldPath, value);
        }
        else {
            console.log("Illegal argument for opStr: " + opStr);
            return null;
        }
        return firebase.firestore._getQuery(collectionPath, query);
    }
    catch (ex) {
        console.log("Error in firebase.firestore.where: " + ex);
        return null;
    }
};
firebase.firestore.orderBy = (collectionPath, fieldPath, direction, query) => {
    query = query.queryOrderedByFieldDescending(fieldPath, direction === "desc");
    return firebase.firestore._getQuery(collectionPath, query);
};
firebase.firestore.limit = (collectionPath, limit, query) => {
    query = query.queryLimitedTo(limit);
    return firebase.firestore._getQuery(collectionPath, query);
};
firebase.firestore.startAfter = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    if (snapshotOrFieldValue && snapshotOrFieldValue.ios) {
        return firebase.firestore._getQuery(collectionPath, query.queryStartingAfterDocument(snapshotOrFieldValue.ios));
    }
    else {
        return firebase.firestore._getQuery(collectionPath, query.queryStartingAfterValues([snapshotOrFieldValue, ...fieldValues]));
    }
};
firebase.firestore.startAt = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    if (snapshotOrFieldValue && snapshotOrFieldValue.ios) {
        return firebase.firestore._getQuery(collectionPath, query.queryStartingAtDocument(snapshotOrFieldValue.ios));
    }
    else {
        return firebase.firestore._getQuery(collectionPath, query.queryStartingAtValues([snapshotOrFieldValue, ...fieldValues]));
    }
};
firebase.firestore.endAt = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    if (snapshotOrFieldValue && snapshotOrFieldValue.ios) {
        return firebase.firestore._getQuery(collectionPath, query.queryEndingAtDocument(snapshotOrFieldValue.ios));
    }
    else {
        return firebase.firestore._getQuery(collectionPath, query.queryEndingAtValues([snapshotOrFieldValue, ...fieldValues]));
    }
};
firebase.firestore.endBefore = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    if (snapshotOrFieldValue && snapshotOrFieldValue.ios) {
        return firebase.firestore._getQuery(collectionPath, query.queryEndingBeforeDocument(snapshotOrFieldValue.ios));
    }
    else {
        return firebase.firestore._getQuery(collectionPath, query.queryEndingBeforeValues([snapshotOrFieldValue, ...fieldValues]));
    }
};
var GIDSignInDelegateImpl = /** @class */ (function (_super) {
    __extends(GIDSignInDelegateImpl, _super);
    function GIDSignInDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GIDSignInDelegateImpl.new = function () {
        if (GIDSignInDelegateImpl.ObjCProtocols.length === 0 && typeof (GIDSignInDelegate) !== "undefined") {
            GIDSignInDelegateImpl.ObjCProtocols.push(GIDSignInDelegate);
        }
        return _super.new.call(this);
    };
    GIDSignInDelegateImpl.prototype.initWithCallback = function (callback) {
        this.callback = callback;
        return this;
    };
    GIDSignInDelegateImpl.prototype.signInDidSignInForUserWithError = function (signIn, user, error) {
        this.callback(user, error);
    };
    GIDSignInDelegateImpl.ObjCProtocols = [];
    return GIDSignInDelegateImpl;
}(NSObject));
function convertDocChangeType(type) {
    switch (type) {
        case 0:
            return 'added';
        case 1:
            return 'modified';
        case 2:
            return 'removed';
        default:
            throw new Error('Unknown DocumentChangeType');
    }
}
function convertDocument(qDoc) {
    return new DocumentSnapshot(qDoc);
}
export class QuerySnapshot {
    constructor(snapshot) {
        this.snapshot = snapshot;
        this.metadata = {
            fromCache: this.snapshot.metadata.fromCache,
            hasPendingWrites: this.snapshot.metadata.pendingWrites
        };
        this.docSnapshots = this.docs;
    }
    get docs() {
        const getSnapshots = () => {
            const docSnapshots = [];
            for (let i = 0, l = this.snapshot.documents.count; i < l; i++) {
                const document = this.snapshot.documents.objectAtIndex(i);
                docSnapshots.push(new DocumentSnapshot(document));
            }
            this._docSnapshots = docSnapshots;
            return docSnapshots;
        };
        return this._docSnapshots || getSnapshots();
    }
    docChanges(options) {
        if (options) {
            console.info('No options support yet, for docChanges()');
        }
        const docChanges = [];
        const jChanges = this.snapshot.documentChanges;
        for (let i = 0; i < jChanges.count; i++) {
            const chg = jChanges[i];
            const type = convertDocChangeType(chg.type);
            const doc = convertDocument(chg.document);
            docChanges.push({
                doc,
                newIndex: chg.newIndex,
                oldIndex: chg.oldIndex,
                type,
            });
        }
        return docChanges;
    }
    forEach(callback, thisArg) {
        this.docSnapshots.map(snapshot => callback(snapshot));
    }
}
var ASAuthorizationControllerDelegateImpl = /** @class */ (function (_super) {
    __extends(ASAuthorizationControllerDelegateImpl, _super); /* implements ASAuthorizationControllerDelegate */
    function ASAuthorizationControllerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASAuthorizationControllerDelegateImpl.createWithOwnerAndResolveReject = function (owner, resolve, reject) {
        // defer initialisation because this is only available since iOS 13
        if (ASAuthorizationControllerDelegateImpl.ObjCProtocols.length === 0 && parseInt(Device.osVersion) >= 13) {
            ASAuthorizationControllerDelegateImpl.ObjCProtocols.push(ASAuthorizationControllerDelegate);
        }
        var delegate = ASAuthorizationControllerDelegateImpl.new();
        delegate.owner = owner;
        delegate.resolve = resolve;
        delegate.reject = reject;
        return delegate;
    };
    ASAuthorizationControllerDelegateImpl.prototype.authorizationControllerDidCompleteWithAuthorization = function (controller, authorization) {
        var _this = this;
        if (authorization.credential instanceof ASAuthorizationAppleIDCredential) {
            var appleIDCredential = authorization.credential;
            var rawNonce = firebase._currentNonce;
            if (!rawNonce) {
                throw new Error("Invalid state: A login callback was received, but no login request was sent.");
            }
            if (!appleIDCredential.identityToken) {
                console.log("Invalid state: A login callback was received, but no login request was sent.");
                return;
            }
            var idToken = NSString.alloc().initWithDataEncoding(appleIDCredential.identityToken, NSUTF8StringEncoding);
            if (!idToken) {
                throw new Error("Unable to serialize id token from data: " + appleIDCredential.identityToken);
            }
            // Initialize a Firebase credential.
            var fIROAuthCredential = FIROAuthProvider.credentialWithProviderIDIDTokenRawNonce("apple.com", idToken, rawNonce);
            // Sign in with Firebase.
            FIRAuth.auth().signInWithCredentialCompletion(fIROAuthCredential, function (authResult, error) {
                if (error) {
                    _this.reject(error.localizedDescription);
                }
                else {
                    firebase.notifyAuthStateListeners({
                        loggedIn: true,
                        user: toLoginResult(authResult.user)
                    });
                    _this.resolve(toLoginResult(authResult && authResult.user, authResult && authResult.additionalUserInfo));
                    firebase.appleAuthDelegate = null;
                }
            });
        }
    };
    ASAuthorizationControllerDelegateImpl.prototype.authorizationControllerDidCompleteWithError = function (controller, error) {
        this.reject(error.localizedDescription);
    };
    ASAuthorizationControllerDelegateImpl.ObjCProtocols = [];
    return ASAuthorizationControllerDelegateImpl;
}(NSObject /* implements ASAuthorizationControllerDelegate */));
var ASAuthorizationControllerPresentationContextProvidingImpl = /** @class */ (function (_super) {
    __extends(ASAuthorizationControllerPresentationContextProvidingImpl, _super); /* implements ASAuthorizationControllerDelegate */
    function ASAuthorizationControllerPresentationContextProvidingImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ASAuthorizationControllerPresentationContextProvidingImpl.createWithOwnerAndCallback = function (owner) {
        // defer initialisation because this is only available since iOS 13
        if (ASAuthorizationControllerPresentationContextProvidingImpl.ObjCProtocols.length === 0 && parseInt(Device.osVersion) >= 13) {
            ASAuthorizationControllerPresentationContextProvidingImpl.ObjCProtocols.push(ASAuthorizationControllerPresentationContextProviding);
        }
        var delegate = ASAuthorizationControllerPresentationContextProvidingImpl.new();
        delegate.owner = owner;
        return delegate;
    };
    ASAuthorizationControllerPresentationContextProvidingImpl.prototype.presentationAnchorForAuthorizationController = function (controller) {
        // nothing to do really
    };
    ASAuthorizationControllerPresentationContextProvidingImpl.ObjCProtocols = [];
    return ASAuthorizationControllerPresentationContextProvidingImpl;
}(NSObject /* implements ASAuthorizationControllerDelegate */));
export * from './firebase-common';
//# sourceMappingURL=firebase.ios.js.map