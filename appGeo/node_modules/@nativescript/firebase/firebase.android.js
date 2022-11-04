import { Application, Utils, AndroidApplication } from "@nativescript/core";
import lazy from "@nativescript/core/utils/lazy";
import { DocumentSnapshot as DocumentSnapshotBase, FieldValue, firebase, GeoPoint, isDocumentReference } from "./firebase-common";
import * as firebaseFunctions from "./functions/functions";
import * as firebaseMessaging from "./messaging/messaging";
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
const gmsAds = com.google.android.gms.ads;
const gmsTasks = com.google.android.gms.tasks;
class DocumentSnapshot extends DocumentSnapshotBase {
    constructor(snapshot) {
        super(snapshot ? snapshot.getId() : null, snapshot.exists(), firebase.toJsObject(snapshot.getData()), firebase.firestore._getDocumentReference(snapshot.getReference()));
        this.snapshot = snapshot;
        this.metadata = {
            fromCache: this.snapshot.getMetadata().isFromCache(),
            hasPendingWrites: this.snapshot.getMetadata().hasPendingWrites()
        };
        this.android = snapshot;
    }
}
firebase._launchNotification = null;
firebase._cachedDynamicLink = null;
firebase._googleSignInIdToken = null;
firebase._facebookAccessToken = null;
firebase._appleSignInIdToken = null;
let fbCallbackManager = null;
let initializeArguments;
const GOOGLE_SIGNIN_INTENT_ID = 123;
const authEnabled = lazy(() => typeof (com.google.firebase.auth) !== "undefined" && typeof (com.google.firebase.auth.FirebaseAuth) !== "undefined");
const messagingEnabled = lazy(() => typeof (com.google.firebase.messaging) !== "undefined");
const dynamicLinksEnabled = lazy(() => typeof (com.google.firebase.dynamiclinks) !== "undefined");
(() => {
    Application.on(Application.launchEvent, args => {
        if (messagingEnabled()) {
            firebaseMessaging.onAppModuleLaunchEvent(args);
        }
        if (dynamicLinksEnabled()) {
            const emailLink = "" + args.android.getData();
            if (authEnabled() && com.google.firebase.auth.FirebaseAuth.getInstance().isSignInWithEmailLink(emailLink)) {
                const rememberedEmail = firebase.getRememberedEmailForEmailLinkLogin();
                if (rememberedEmail !== undefined) {
                    const emailLinkOnCompleteListener = new gmsTasks.OnCompleteListener({
                        onComplete: task => {
                            if (task.isSuccessful()) {
                                const authResult = task.getResult();
                                firebase.notifyAuthStateListeners({
                                    loggedIn: true,
                                    user: toLoginResult(authResult.getUser(), authResult.getAdditionalUserInfo())
                                });
                            }
                        }
                    });
                    const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                    if (user) {
                        const authCredential = com.google.firebase.auth.EmailAuthProvider.getCredentialWithLink(rememberedEmail, emailLink);
                        user.linkWithCredential(authCredential).addOnCompleteListener(emailLinkOnCompleteListener);
                    }
                    else {
                        com.google.firebase.auth.FirebaseAuth.getInstance().signInWithEmailLink(rememberedEmail, emailLink).addOnCompleteListener(emailLinkOnCompleteListener);
                    }
                }
            }
            else {
                const getDynamicLinksCallback = new gmsTasks.OnSuccessListener({
                    onSuccess: pendingDynamicLinkData => {
                        if (pendingDynamicLinkData != null) {
                            const deepLink = pendingDynamicLinkData.getLink().toString();
                            const minimumAppVersion = pendingDynamicLinkData.getMinimumAppVersion();
                            if (firebase._dynamicLinkCallback === null) {
                                firebase._cachedDynamicLink = {
                                    url: deepLink,
                                    minimumAppVersion: minimumAppVersion
                                };
                            }
                            else {
                                setTimeout(function () {
                                    firebase._dynamicLinkCallback({
                                        url: deepLink,
                                        minimumAppVersion: minimumAppVersion
                                    });
                                });
                            }
                        }
                    }
                });
                const firebaseDynamicLinks = com.google.firebase.dynamiclinks.FirebaseDynamicLinks.getInstance();
                firebaseDynamicLinks.getDynamicLink(args.android).addOnSuccessListener(getDynamicLinksCallback);
            }
        }
    });
    Application.on(Application.resumeEvent, args => {
        if (messagingEnabled()) {
            firebaseMessaging.onAppModuleResumeEvent(args);
        }
    });
})();
firebase.toHashMap = obj => {
    const node = new java.util.HashMap();
    for (const property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (obj[property] === null) {
                node.put(property, null);
            }
            else {
                if (obj[property] === "SERVER_TIMESTAMP") {
                    node.put(property, com.google.firebase.firestore.FieldValue.serverTimestamp());
                }
                else if (obj[property] === "DELETE_FIELD") {
                    node.put(property, com.google.firebase.firestore.FieldValue.delete());
                }
                else if (obj[property] instanceof FieldValue) {
                    const fieldValue = obj[property];
                    if (fieldValue.type === "ARRAY_UNION") {
                        let values = Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value;
                        values = values.map(v => typeof (v) === "object" ? firebase.toHashMap(v) : v);
                        node.put(property, com.google.firebase.firestore.FieldValue.arrayUnion(values));
                    }
                    else if (fieldValue.type === "ARRAY_REMOVE") {
                        let values = Array.isArray(fieldValue.value[0]) ? fieldValue.value[0] : fieldValue.value;
                        values = values.map(v => typeof (v) === "object" ? firebase.toHashMap(v) : v);
                        node.put(property, com.google.firebase.firestore.FieldValue.arrayRemove(values));
                    }
                    else if (fieldValue.type === "INCREMENT") {
                        node.put(property, com.google.firebase.firestore.FieldValue.increment(fieldValue.value));
                    }
                    else {
                        console.log("You found a bug! Please report an issue at https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues, mention fieldValue.type = '" + fieldValue.type + "'. Thanks!");
                    }
                }
                else if (obj[property] instanceof Date) {
                    node.put(property, new java.util.Date(obj[property].getTime()));
                }
                else if (obj[property] instanceof GeoPoint) {
                    const geo = obj[property];
                    node.put(property, new com.google.firebase.firestore.GeoPoint(geo.latitude, geo.longitude));
                }
                else if (isDocumentReference(obj[property])) {
                    node.put(property, obj[property].android);
                }
                else if (Array.isArray(obj[property])) {
                    node.put(property, firebase.toJavaArray(obj[property]));
                }
                else {
                    switch (typeof obj[property]) {
                        case 'object':
                            node.put(property, firebase.toHashMap(obj[property], node));
                            break;
                        case 'boolean':
                            node.put(property, java.lang.Boolean.valueOf(String(obj[property])));
                            break;
                        case 'number':
                            if (Number(obj[property]) === obj[property] && obj[property] % 1 === 0)
                                node.put(property, java.lang.Long.valueOf(String(obj[property])));
                            else
                                node.put(property, java.lang.Double.valueOf(String(obj[property])));
                            break;
                        case 'string':
                            node.put(property, String(obj[property]));
                            break;
                    }
                }
            }
        }
    }
    return node;
};
firebase.toJavaArray = val => {
    const javaArray = new java.util.ArrayList();
    for (let i = 0; i < val.length; i++) {
        javaArray.add(firebase.toValue(val[i]));
    }
    return javaArray;
};
firebase.toValue = val => {
    let returnVal = null;
    if (val !== null) {
        if (val instanceof Date) {
            returnVal = new java.util.Date(val.getTime());
        }
        else if (Array.isArray(val)) {
            returnVal = firebase.toJavaArray(val);
        }
        else if (val instanceof GeoPoint) {
            returnVal = new com.google.firebase.firestore.GeoPoint(val.latitude, val.longitude);
        }
        else if (isDocumentReference(val)) {
            returnVal = val.android;
        }
        else {
            switch (typeof val) {
                case 'object':
                    returnVal = firebase.toHashMap(val);
                    break;
                case 'boolean':
                    returnVal = java.lang.Boolean.valueOf(String(val));
                    break;
                case 'number':
                    if (Number(val) === val && val % 1 === 0)
                        returnVal = java.lang.Long.valueOf(String(val));
                    else
                        returnVal = java.lang.Double.valueOf(String(val));
                    break;
                case 'string':
                    returnVal = String(val);
                    break;
            }
        }
    }
    return returnVal;
};
firebase.toJsObject = javaObj => {
    if (javaObj === null || typeof javaObj !== "object") {
        return javaObj;
    }
    let node;
    switch (javaObj.getClass().getName()) {
        case 'java.lang.Boolean':
            const str = String(javaObj);
            return Boolean(!!(str === "True" || str === "true"));
        case 'java.lang.String':
            return String(javaObj);
        case 'java.lang.Integer':
        case 'java.lang.Long':
        case 'java.lang.Double':
            return Number(String(javaObj));
        case 'java.util.Date':
            return new Date(javaObj.getTime());
        case 'com.google.firebase.Timestamp':
            return new Date(javaObj.toDate().getTime());
        case 'com.google.firebase.firestore.GeoPoint':
            return {
                "latitude": javaObj.getLatitude(),
                "longitude": javaObj.getLongitude()
            };
        case 'com.google.firebase.firestore.DocumentReference':
            const path = javaObj.getPath();
            const lastSlashIndex = path.lastIndexOf("/");
            return firebase.firestore._getDocumentReference(javaObj, path.substring(0, lastSlashIndex), path.substring(lastSlashIndex + 1));
        case 'java.util.ArrayList':
            node = [];
            for (let i = 0; i < javaObj.size(); i++) {
                node[i] = firebase.toJsObject(javaObj.get(i));
            }
            break;
        case 'android.util.ArrayMap':
        case 'android.support.v4.util.ArrayMap':
        case 'androidx.collection.ArrayMap':
            node = {};
            for (let i = 0; i < javaObj.size(); i++) {
                node[javaObj.keyAt(i)] = firebase.toJsObject(javaObj.valueAt(i));
            }
            break;
        default:
            try {
                node = {};
                const iterator = javaObj.entrySet().iterator();
                while (iterator.hasNext()) {
                    const item = iterator.next();
                    node[item.getKey()] = firebase.toJsObject(item.getValue());
                }
            }
            catch (e) {
                if (JSON.stringify(e).includes("Attempt to use cleared object reference")) {
                    console.log("Error while transforming Java to Js: " + e);
                }
                else {
                    console.log("PLEASE REPORT THIS AT https://github.com/EddyVerbruggen/nativescript-plugin-firebase/issues: Tried to serialize an unsupported type: " + javaObj.getClass().getName() + ", error: " + e);
                }
            }
    }
    return node;
};
firebase.getCallbackData = (type, snapshot) => {
    return {
        type: type,
        key: snapshot.getKey(),
        value: firebase.toJsObject(snapshot.getValue())
    };
};
firebase.authStateListener = null;
firebase.init = arg => {
    return new Promise((resolve, reject) => {
        if (firebase.initialized) {
            reject("Firebase already initialized");
            return;
        }
        firebase.initialized = true;
        const runInit = () => {
            arg = arg || {};
            initializeArguments = arg;
            if (typeof (com.google.firebase.analytics) !== "undefined" && typeof (com.google.firebase.analytics.FirebaseAnalytics) !== "undefined") {
                com.google.firebase.analytics.FirebaseAnalytics.getInstance(Application.android.context || Application.getNativeApplication()).setAnalyticsCollectionEnabled(arg.analyticsCollectionEnabled !== false);
            }
            if (typeof (com.google.firebase.database) !== "undefined" && typeof (com.google.firebase.database.ServerValue) !== "undefined") {
                firebase.ServerValue = {
                    TIMESTAMP: firebase.toJsObject(com.google.firebase.database.ServerValue.TIMESTAMP)
                };
                const fDatabase = com.google.firebase.database.FirebaseDatabase;
                if (arg.persist) {
                    try {
                        fDatabase.getInstance().setPersistenceEnabled(true);
                    }
                    catch (ignore) {
                    }
                }
                firebase.instance = fDatabase.getInstance().getReference();
            }
            if (arg.persist === false && typeof (com.google.firebase.firestore) !== "undefined") {
                try {
                    com.google.firebase.firestore.FirebaseFirestore.getInstance().setFirestoreSettings(new com.google.firebase.firestore.FirebaseFirestoreSettings.Builder()
                        .setPersistenceEnabled(false)
                        .build());
                }
                catch (ignore) {
                }
            }
            if (authEnabled()) {
                const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
                if (arg.onAuthStateChanged) {
                    firebase.addAuthStateListener(arg.onAuthStateChanged);
                }
                if (!firebase.authStateListener) {
                    firebase.authStateListener = new com.google.firebase.auth.FirebaseAuth.AuthStateListener({
                        onAuthStateChanged: fbAuth => {
                            const user = fbAuth.getCurrentUser();
                            firebase.notifyAuthStateListeners({
                                loggedIn: user !== null,
                                user: toLoginResult(user)
                            });
                        }
                    });
                    firebaseAuth.addAuthStateListener(firebase.authStateListener);
                }
            }
            if (messagingEnabled()) {
                firebaseMessaging.initFirebaseMessaging(arg);
            }
            if (arg.onDynamicLinkCallback !== undefined) {
                firebase.addOnDynamicLinkReceivedCallback(arg.onDynamicLinkCallback);
            }
            if (arg.storageBucket) {
                if (typeof (com.google.firebase.storage) === "undefined") {
                    reject("Uncomment firebase-storage in the plugin's include.gradle first");
                    return;
                }
                firebase.storageBucket = com.google.firebase.storage.FirebaseStorage.getInstance().getReferenceFromUrl(arg.storageBucket);
            }
            if (typeof (gmsAds) !== "undefined" && typeof (gmsAds.MobileAds) !== "undefined") {
                gmsAds.MobileAds.initialize(Application.android.context);
            }
            resolve(firebase.instance);
        };
        try {
            if (Application.android.startActivity) {
                runInit();
            }
            else {
                Application.on(Application.launchEvent, runInit);
            }
        }
        catch (ex) {
            console.log("Error in firebase.init: " + ex);
            reject(ex);
        }
    });
};
firebase.fetchSignInMethodsForEmail = email => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (email) !== "string") {
                reject("A parameter representing an email address is required.");
                return;
            }
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                    else {
                        const signInMethods = task.getResult().getSignInMethods();
                        resolve(firebase.toJsObject(signInMethods));
                    }
                }
            });
            com.google.firebase.auth.FirebaseAuth.getInstance().fetchSignInMethodsForEmail(email).addOnCompleteListener(onCompleteListener);
        }
        catch (ex) {
            console.log("Error in firebase.fetchSignInMethodsForEmail: " + ex);
            reject(ex);
        }
    });
};
firebase.getCurrentPushToken = firebaseMessaging.getCurrentPushToken;
firebase.addOnMessageReceivedCallback = firebaseMessaging.addOnMessageReceivedCallback;
firebase.addOnPushTokenReceivedCallback = firebaseMessaging.addOnPushTokenReceivedCallback;
firebase.registerForPushNotifications = firebaseMessaging.registerForPushNotifications;
firebase.unregisterForPushNotifications = firebaseMessaging.unregisterForPushNotifications;
firebase.subscribeToTopic = firebaseMessaging.subscribeToTopic;
firebase.unsubscribeFromTopic = firebaseMessaging.unsubscribeFromTopic;
firebase.areNotificationsEnabled = firebaseMessaging.areNotificationsEnabled;
firebase.functions = firebaseFunctions;
firebase.addOnDynamicLinkReceivedCallback = callback => {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (com.google.firebase.dynamiclinks) === "undefined") {
                reject("Uncomment dynamic links in the plugin's include.gradle first");
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
firebase.getRemoteConfigDefaults = properties => {
    let defaults = {};
    for (const p in properties) {
        const prop = properties[p];
        if (prop.default !== undefined) {
            defaults[prop.key] = prop.default;
        }
    }
    return defaults;
};
firebase._isGooglePlayServicesAvailable = () => {
    const ctx = Application.android.foregroundActivity || Application.android.startActivity || Application.getNativeApplication();
    const googleApiAvailability = com.google.android.gms.common.GoogleApiAvailability.getInstance();
    const playServiceStatusSuccess = 0;
    const playServicesStatus = googleApiAvailability.isGooglePlayServicesAvailable(ctx);
    const available = playServicesStatus === playServiceStatusSuccess;
    if (!available && googleApiAvailability.isUserResolvableError(playServicesStatus)) {
        googleApiAvailability.showErrorDialogFragment(ctx, playServicesStatus, 1, new android.content.DialogInterface.OnCancelListener({
            onCancel: dialogInterface => {
                console.log("Canceled");
            }
        }));
    }
    return available;
};
firebase.getRemoteConfig = arg => {
    return new Promise((resolve, reject) => {
        if (typeof (com.google.firebase.remoteconfig) === "undefined") {
            reject("Uncomment firebase-config in the plugin's include.gradle first");
            return;
        }
        if (arg.properties === undefined) {
            reject("Argument 'properties' is missing");
            return;
        }
        const runGetRemoteConfig = () => {
            if (!firebase._isGooglePlayServicesAvailable()) {
                reject("Google Play services is required for this feature, but not available on this device");
                return;
            }
            const firebaseRemoteConfig = com.google.firebase.remoteconfig.FirebaseRemoteConfig.getInstance();
            const remoteConfigSettingsBuilder = new com.google.firebase.remoteconfig.FirebaseRemoteConfigSettings.Builder();
            if (arg.developerMode === true) {
                remoteConfigSettingsBuilder.setFetchTimeoutInSeconds(0);
            }
            const onSetConfigSettingsCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                    else {
                        const defaults = firebase.getRemoteConfigDefaults(arg.properties);
                        firebaseRemoteConfig.setDefaultsAsync(firebase.toHashMap(defaults))
                            .addOnCompleteListener(new gmsTasks.OnCompleteListener({
                            onComplete: task => {
                                if (!task.isSuccessful()) {
                                    reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                                }
                                else {
                                    const returnMethod = throttled => {
                                        const addOnCompleteActivateListener = new gmsTasks.OnCompleteListener({
                                            onComplete: task => {
                                                if (!task.isSuccessful()) {
                                                    reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                                                }
                                                else {
                                                    const lastFetchTime = firebaseRemoteConfig.getInfo().getFetchTimeMillis();
                                                    const lastFetch = new Date(lastFetchTime);
                                                    const result = {
                                                        lastFetch,
                                                        throttled,
                                                        properties: {}
                                                    };
                                                    for (const p in arg.properties) {
                                                        const prop = arg.properties[p];
                                                        const key = prop.key;
                                                        const value = firebaseRemoteConfig.getString(key);
                                                        result.properties[key] = firebase.strongTypeify(value);
                                                    }
                                                    resolve(result);
                                                }
                                            }
                                        });
                                        firebaseRemoteConfig.activate().addOnCompleteListener(addOnCompleteActivateListener);
                                    };
                                    const onSuccessListener = new gmsTasks.OnSuccessListener({
                                        onSuccess: () => returnMethod(false)
                                    });
                                    const onFailureListener = new gmsTasks.OnFailureListener({
                                        onFailure: exception => {
                                            if (exception.getMessage() === "com.google.firebase.remoteconfig.FirebaseRemoteConfigFetchThrottledException") {
                                                returnMethod(true);
                                            }
                                            else {
                                                reject("Retrieving remote config data failed. " + exception);
                                            }
                                        }
                                    });
                                    const expirationDuration = arg.cacheExpirationSeconds || 43200;
                                    firebaseRemoteConfig.fetch(expirationDuration)
                                        .addOnSuccessListener(onSuccessListener)
                                        .addOnFailureListener(onFailureListener);
                                }
                            }
                        }));
                    }
                }
            });
            firebaseRemoteConfig.setConfigSettingsAsync(remoteConfigSettingsBuilder.build())
                .addOnCompleteListener(onSetConfigSettingsCompleteListener);
        };
        try {
            if (Application.android.foregroundActivity) {
                runGetRemoteConfig();
            }
            else {
                const callback = () => {
                    runGetRemoteConfig();
                    Application.off(Application.resumeEvent, callback);
                };
                Application.on(Application.resumeEvent, callback);
            }
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
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            const user = firebaseAuth.getCurrentUser();
            if (user !== null) {
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
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            const user = firebaseAuth.getCurrentUser();
            if (user !== null) {
                const addOnCompleteListener = new gmsTasks.OnCompleteListener({
                    onComplete: task => {
                        if (!task.isSuccessful()) {
                            reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        }
                        else {
                            resolve();
                        }
                    }
                });
                if (actionCodeSettings) {
                    const settingsBuilder = new com.google.firebase.auth.ActionCodeSettings.newBuilder();
                    if (actionCodeSettings.handleCodeInApp !== undefined) {
                        settingsBuilder.setHandleCodeInApp(actionCodeSettings.handleCodeInApp);
                    }
                    if (actionCodeSettings.url) {
                        settingsBuilder.setUrl(actionCodeSettings.url);
                    }
                    if (actionCodeSettings.iOS && actionCodeSettings.iOS.bundleId) {
                        settingsBuilder.setIOSBundleId(actionCodeSettings.iOS.bundleId);
                    }
                    if (actionCodeSettings.android && actionCodeSettings.android.packageName) {
                        settingsBuilder.setAndroidPackageName(actionCodeSettings.android.packageName, actionCodeSettings.android.installApp, actionCodeSettings.android.minimumVersion || null);
                    }
                    user.sendEmailVerification(settingsBuilder.build()).addOnCompleteListener(addOnCompleteListener);
                }
                else {
                    user.sendEmailVerification().addOnCompleteListener(addOnCompleteListener);
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
            com.google.firebase.auth.FirebaseAuth.getInstance().signOut();
            firebase.currentAdditionalUserInfo = null;
            if (firebase._mGoogleApiClient && firebase._mGoogleApiClient.isConnected()) {
                com.google.android.gms.auth.api.Auth.GoogleSignInApi.revokeAccess(firebase._mGoogleApiClient);
            }
            if (typeof (com.facebook) !== "undefined" && typeof (com.facebook.login) !== "undefined") {
                com.facebook.login.LoginManager.getInstance().logOut();
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
            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
            if (!user) {
                reject("Not logged in");
                return;
            }
            user.unlink(providerId)
                .addOnCompleteListener(new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve();
                    }
                    else {
                        reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                }
            }));
        }
        catch (ex) {
            console.log("Error in firebase.unlink: " + ex);
            reject(ex);
        }
    });
};
firebase.getAuthToken = (arg) => {
    return new Promise((resolve, reject) => {
        try {
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            const user = firebaseAuth.getCurrentUser();
            if (user !== null) {
                const onSuccessListener = new gmsTasks.OnSuccessListener({
                    onSuccess: tokenResult => {
                        resolve({
                            token: tokenResult.getToken(),
                            claims: firebase.toJsObject(tokenResult.getClaims()),
                            signInProvider: tokenResult.getSignInProvider(),
                            expirationTime: tokenResult.getExpirationTimestamp(),
                            issuedAtTime: tokenResult.getIssuedAtTimestamp(),
                            authTime: tokenResult.getAuthTimestamp()
                        });
                    }
                });
                const onFailureListener = new gmsTasks.OnFailureListener({
                    onFailure: exception => {
                        reject(exception);
                    }
                });
                user.getIdToken(arg.forceRefresh)
                    .addOnSuccessListener(onSuccessListener)
                    .addOnFailureListener(onFailureListener);
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
function toLoginResult(user, additionalUserInfo) {
    if (user === null) {
        return null;
    }
    if (additionalUserInfo) {
        firebase.currentAdditionalUserInfo = additionalUserInfo;
    }
    const providers = [];
    const providerData = user.getProviderData();
    for (let i = 0; i < providerData.size(); i++) {
        const pid = providerData.get(i).getProviderId();
        if (pid === 'facebook.com') {
            providers.push({ id: pid, token: firebase._facebookAccessToken });
        }
        else if (pid === 'google.com') {
            providers.push({ id: pid, token: firebase._googleSignInIdToken });
        }
        else if (pid === 'apple.com') {
            providers.push({ id: pid, token: firebase._appleSignInIdToken });
        }
        else {
            providers.push({ id: pid });
        }
    }
    const loginResult = {
        uid: user.getUid(),
        displayName: user.getDisplayName(),
        email: user.getEmail(),
        emailVerified: user.isEmailVerified(),
        providers: providers,
        anonymous: user.isAnonymous(),
        isAnonymous: user.isAnonymous(),
        phoneNumber: user.getPhoneNumber(),
        photoURL: user.getPhotoUrl() ? user.getPhotoUrl().toString() : null,
        metadata: {
            creationTimestamp: user.getMetadata() ? new Date(user.getMetadata().getCreationTimestamp()) : null,
            lastSignInTimestamp: user.getMetadata() ? new Date(user.getMetadata().getLastSignInTimestamp()) : null
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
            providerId: firebase.currentAdditionalUserInfo.getProviderId(),
            username: firebase.currentAdditionalUserInfo.getUsername(),
            isNewUser: firebase.currentAdditionalUserInfo.isNewUser(),
            profile: firebase.toJsObject(firebase.currentAdditionalUserInfo.getProfile())
        };
    }
    return loginResult;
}
firebase.login = arg => {
    return new Promise((resolve, reject) => {
        try {
            firebase.resolve = resolve;
            firebase.reject = reject;
            if (!firebase._isGooglePlayServicesAvailable()) {
                reject("Google Play services is required for this feature, but not available on this device");
                return;
            }
            firebase.moveLoginOptionsToObjects(arg);
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        console.log("Logging in the user failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        if (firebase._mGoogleApiClient) {
                            com.google.android.gms.auth.api.Auth.GoogleSignInApi.revokeAccess(firebase._mGoogleApiClient);
                        }
                        if (firebase.reject) {
                            firebase.reject("Logging in the user failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        }
                    }
                    else {
                        const user = task.getResult().getUser();
                        let additionalUserInfo = task.getResult().getAdditionalUserInfo();
                        if (firebase.resolve) {
                            firebase.resolve(toLoginResult(user, additionalUserInfo));
                        }
                    }
                }
            });
            if (arg.type === firebase.LoginType.ANONYMOUS) {
                firebaseAuth.signInAnonymously().addOnCompleteListener(onCompleteListener);
            }
            else if (arg.type === firebase.LoginType.PASSWORD) {
                if (!arg.passwordOptions || !arg.passwordOptions.email || !arg.passwordOptions.password) {
                    reject("Auth type PASSWORD requires an 'passwordOptions.email' and 'passwordOptions.password' argument");
                    return;
                }
                const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                if (user) {
                    if (firebase._alreadyLinkedToAuthProvider(user, "password")) {
                        firebaseAuth.signInWithEmailAndPassword(arg.passwordOptions.email, arg.passwordOptions.password).addOnCompleteListener(onCompleteListener);
                    }
                    else {
                        const authCredential = com.google.firebase.auth.EmailAuthProvider.getCredential(arg.passwordOptions.email, arg.passwordOptions.password);
                        user.linkWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                    }
                }
                else {
                    firebaseAuth.signInWithEmailAndPassword(arg.passwordOptions.email, arg.passwordOptions.password).addOnCompleteListener(onCompleteListener);
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
                const actionCodeSettings = com.google.firebase.auth.ActionCodeSettings.newBuilder()
                    .setUrl(arg.emailLinkOptions.url)
                    .setHandleCodeInApp(true)
                    .setIOSBundleId(arg.emailLinkOptions.iOS ? arg.emailLinkOptions.iOS.bundleId : Application.android.context.getPackageName())
                    .setAndroidPackageName(arg.emailLinkOptions.android ? arg.emailLinkOptions.android.packageName : Application.android.context.getPackageName(), arg.emailLinkOptions.android ? arg.emailLinkOptions.android.installApp || false : false, arg.emailLinkOptions.android ? arg.emailLinkOptions.android.minimumVersion || "1" : "1")
                    .build();
                const onEmailLinkCompleteListener = new gmsTasks.OnCompleteListener({
                    onComplete: task => {
                        if (!task.isSuccessful()) {
                            reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        }
                        else {
                            firebase.rememberEmailForEmailLinkLogin(arg.emailLinkOptions.email);
                            resolve();
                        }
                    }
                });
                firebaseAuth.sendSignInLinkToEmail(arg.emailLinkOptions.email, actionCodeSettings).addOnCompleteListener(onEmailLinkCompleteListener);
            }
            else if (arg.type === firebase.LoginType.PHONE) {
                if (!arg.phoneOptions || !arg.phoneOptions.phoneNumber) {
                    reject("Auth type PHONE requires a 'phoneOptions.phoneNumber' argument");
                    return;
                }
                const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                if (user && firebase._alreadyLinkedToAuthProvider(user, "phone")) {
                    resolve(toLoginResult(user));
                    return;
                }
                const OnVerificationStateChangedCallbacks = com.google.firebase.auth.PhoneAuthProvider.OnVerificationStateChangedCallbacks.extend({
                    onVerificationCompleted: phoneAuthCredential => {
                        firebase._verifyPhoneNumberInProgress = false;
                        const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                        if (!user || firebase._alreadyLinkedToAuthProvider(user, "phone")) {
                            firebaseAuth.signInWithCredential(phoneAuthCredential).addOnCompleteListener(onCompleteListener);
                        }
                        else {
                            user.linkWithCredential(phoneAuthCredential).addOnCompleteListener(onCompleteListener);
                        }
                    },
                    onVerificationFailed: firebaseException => {
                        firebase._verifyPhoneNumberInProgress = false;
                        const errorMessage = firebaseException.getMessage();
                        if (errorMessage.includes("INVALID_APP_CREDENTIAL")) {
                            if (firebase.reject) {
                                firebase.reject("Please upload the SHA1 fingerprint of your debug and release keystores to the Firebase console, see https://github.com/EddyVerbruggen/nativescript-plugin-firebase/blob/master/docs/AUTHENTICATION.md#phone-verification");
                            }
                        }
                        else {
                            if (firebase.reject) {
                                firebase.reject(errorMessage);
                            }
                        }
                    },
                    onCodeSent: (verificationId, forceResendingToken) => {
                        setTimeout(() => {
                            if (firebase._verifyPhoneNumberInProgress) {
                                firebase._verifyPhoneNumberInProgress = false;
                                firebase.requestPhoneAuthVerificationCode(userResponse => {
                                    if (userResponse === undefined && firebase.reject) {
                                        firebase.reject("Prompt was canceled");
                                        return;
                                    }
                                    const authCredential = com.google.firebase.auth.PhoneAuthProvider.getCredential(verificationId, userResponse);
                                    const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                                    if (!user || firebase._alreadyLinkedToAuthProvider(user, "phone")) {
                                        firebaseAuth.signInWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                                    }
                                    else {
                                        user.linkWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                                    }
                                }, arg.phoneOptions.verificationPrompt);
                            }
                        }, 3000);
                    }
                });
                firebase._verifyPhoneNumberInProgress = true;
                let timeout = arg.phoneOptions.android ? arg.phoneOptions.android.timeout : 60;
                com.google.firebase.auth.PhoneAuthProvider.getInstance().verifyPhoneNumber(arg.phoneOptions.phoneNumber, timeout, java.util.concurrent.TimeUnit.SECONDS, Application.android.foregroundActivity, new OnVerificationStateChangedCallbacks());
            }
            else if (arg.type === firebase.LoginType.CUSTOM) {
                if (!arg.customOptions || (!arg.customOptions.token && !arg.customOptions.tokenProviderFn)) {
                    reject("Auth type CUSTOM requires a 'customOptions.token' or 'customOptions.tokenProviderFn' argument");
                    return;
                }
                if (arg.customOptions.token) {
                    firebaseAuth.signInWithCustomToken(arg.customOptions.token).addOnCompleteListener(onCompleteListener);
                }
                else if (arg.customOptions.tokenProviderFn) {
                    arg.customOptions.tokenProviderFn()
                        .then(token => {
                        firebaseAuth.signInWithCustomToken(token).addOnCompleteListener(onCompleteListener);
                    }, error => {
                        reject(error);
                    });
                }
            }
            else if (arg.type === firebase.LoginType.FACEBOOK) {
                if (typeof (com.facebook) === "undefined" || typeof (com.facebook.FacebookSdk) === "undefined") {
                    reject("Facebook SDK not installed - see gradle config");
                    return;
                }
                if (!fbCallbackManager) {
                    com.facebook.FacebookSdk.sdkInitialize(Application.getNativeApplication());
                    fbCallbackManager = com.facebook.CallbackManager.Factory.create();
                }
                const callback = (eventData) => {
                    Application.android.off(AndroidApplication.activityResultEvent, callback);
                    fbCallbackManager.onActivityResult(eventData.requestCode, eventData.resultCode, eventData.intent);
                };
                Application.android.on(AndroidApplication.activityResultEvent, callback);
                const fbLoginManager = com.facebook.login.LoginManager.getInstance();
                fbLoginManager.registerCallback(fbCallbackManager, new com.facebook.FacebookCallback({
                    onSuccess: loginResult => {
                        firebase._facebookAccessToken = loginResult.getAccessToken().getToken();
                        const authCredential = com.google.firebase.auth.FacebookAuthProvider.getCredential(firebase._facebookAccessToken);
                        const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                        if (user) {
                            if (firebase._alreadyLinkedToAuthProvider(user, "facebook.com")) {
                                firebaseAuth.signInWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                            }
                            else {
                                user.linkWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                            }
                        }
                        else {
                            firebaseAuth.signInWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                        }
                    },
                    onCancel: () => reject("Facebook Login canceled"),
                    onError: ex => reject("Error while trying to login with Fb " + ex)
                }));
                let scopes = ["public_profile", "email"];
                if (arg.facebookOptions && arg.facebookOptions.scopes) {
                    scopes = arg.facebookOptions.scopes;
                }
                const permissions = Utils.android.collections.stringArrayToStringSet(scopes);
                const activity = Application.android.foregroundActivity;
                fbLoginManager.logInWithReadPermissions(activity, permissions);
            }
            else if (arg.type === firebase.LoginType.APPLE) {
                const onSuccessListener = new gmsTasks.OnSuccessListener({
                    onSuccess: (authResult) => {
                        firebase._appleSignInIdToken = authResult.getCredential().getIdToken();
                        const loginResult = toLoginResult(authResult.getUser(), authResult.getAdditionalUserInfo());
                        firebase.notifyAuthStateListeners({
                            loggedIn: true,
                            user: loginResult
                        });
                        resolve(loginResult);
                    }
                });
                const onFailureListener = new gmsTasks.OnFailureListener({
                    onFailure: exception => {
                        reject(exception.getMessage());
                    }
                });
                const pendingAuthResult = firebaseAuth.getPendingAuthResult();
                if (pendingAuthResult) {
                    pendingAuthResult
                        .addOnSuccessListener(onSuccessListener)
                        .addOnFailureListener(onFailureListener);
                }
                else {
                    const oAuthProviderBuilder = com.google.firebase.auth.OAuthProvider.newBuilder("apple.com");
                    let scopes = ["name", "email"];
                    if (arg.appleOptions && arg.appleOptions.scopes) {
                        scopes = arg.appleOptions.scopes;
                    }
                    oAuthProviderBuilder.setScopes(firebase.toJavaArray(scopes));
                    if (arg.appleOptions && arg.appleOptions.locale) {
                        oAuthProviderBuilder.addCustomParameter("locale", arg.appleOptions.locale);
                    }
                    const provider = oAuthProviderBuilder.build();
                    firebaseAuth.startActivityForSignInWithProvider(Application.android.foregroundActivity || Application.android.startActivity, provider)
                        .addOnSuccessListener(onSuccessListener)
                        .addOnFailureListener(onFailureListener);
                }
            }
            else if (arg.type === firebase.LoginType.GOOGLE) {
                if (typeof (com.google.android.gms.auth.api.Auth) === "undefined") {
                    reject("Google Sign In not installed - see gradle config");
                    return;
                }
                const clientStringId = Utils.android.resources.getStringId("default_web_client_id");
                const clientId = Utils.android.getApplicationContext().getResources().getString(clientStringId);
                const googleSignInOptionsBuilder = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(clientId)
                    .requestEmail();
                if (arg.googleOptions && arg.googleOptions.hostedDomain) {
                    googleSignInOptionsBuilder.setHostedDomain(arg.googleOptions.hostedDomain);
                }
                if (arg.googleOptions && arg.googleOptions.scopes) {
                    const scopesArray = [];
                    if (arg.googleOptions.scopes.length > 1) {
                        arg.googleOptions.scopes.forEach(s => scopesArray.push(new com.google.android.gms.common.api.Scope(s)));
                    }
                    googleSignInOptionsBuilder.requestScopes(new com.google.android.gms.common.api.Scope(arg.googleOptions.scopes[0]), scopesArray);
                }
                const googleSignInOptions = googleSignInOptionsBuilder.build();
                const onConnectionFailedListener = new com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener({
                    onConnectionFailed: connectionResult => {
                        reject(connectionResult.getErrorMessage());
                    }
                });
                firebase._mGoogleApiClient = new com.google.android.gms.common.api.GoogleApiClient.Builder(Application.getNativeApplication())
                    .addOnConnectionFailedListener(onConnectionFailedListener)
                    .addApi(com.google.android.gms.auth.api.Auth.GOOGLE_SIGN_IN_API, googleSignInOptions)
                    .build();
                const signInIntent = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInIntent(firebase._mGoogleApiClient);
                (Application.android.foregroundActivity || Application.android.startActivity).startActivityForResult(signInIntent, GOOGLE_SIGNIN_INTENT_ID);
                const callback = (eventData) => {
                    if (eventData.requestCode === GOOGLE_SIGNIN_INTENT_ID) {
                        Application.android.off(AndroidApplication.activityResultEvent, callback);
                        const googleSignInResult = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInResultFromIntent(eventData.intent);
                        if (googleSignInResult === null) {
                            reject("No googleSignInResult, eventData.intent seems to be invalid");
                            return;
                        }
                        const success = googleSignInResult.isSuccess();
                        if (success) {
                            const googleSignInAccount = googleSignInResult.getSignInAccount();
                            firebase._googleSignInIdToken = googleSignInAccount.getIdToken();
                            const accessToken = null;
                            const authCredential = com.google.firebase.auth.GoogleAuthProvider.getCredential(firebase._googleSignInIdToken, accessToken);
                            firebase._mGoogleApiClient.connect();
                            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                            if (user) {
                                if (firebase._alreadyLinkedToAuthProvider(user, "google.com")) {
                                    firebaseAuth.signInWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                                }
                                else {
                                    user.linkWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                                }
                            }
                            else {
                                firebaseAuth.signInWithCredential(authCredential).addOnCompleteListener(onCompleteListener);
                            }
                        }
                        else {
                            console.log("Make sure you've uploaded your SHA1 fingerprint(s) to the Firebase console. Status: " + googleSignInResult.getStatus());
                            reject("Has the SHA1 fingerprint been uploaded? Sign-in status: " + googleSignInResult.getStatus());
                        }
                    }
                };
                Application.android.on(AndroidApplication.activityResultEvent, callback);
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
firebase._alreadyLinkedToAuthProvider = (user, providerId) => {
    const providerData = user.getProviderData();
    for (let i = 0; i < providerData.size(); i++) {
        const profile = providerData.get(i);
        if (profile.getProviderId() === providerId) {
            return true;
        }
    }
    return false;
};
firebase.reauthenticate = arg => {
    return new Promise((resolve, reject) => {
        try {
            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
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
                authCredential = com.google.firebase.auth.EmailAuthProvider.getCredential(arg.passwordOptions.email, arg.passwordOptions.password);
            }
            else if (arg.type === firebase.LoginType.GOOGLE) {
                if (!firebase._googleSignInIdToken) {
                    reject("Not currently logged in with Google");
                    return;
                }
                authCredential = com.google.firebase.auth.GoogleAuthProvider.getCredential(firebase._googleSignInIdToken, null);
            }
            else if (arg.type === firebase.LoginType.FACEBOOK) {
                if (!firebase._facebookAccessToken) {
                    reject("Not currently logged in with Facebook");
                    return;
                }
                authCredential = com.google.firebase.auth.FacebookAuthProvider.getCredential(firebase._facebookAccessToken);
            }
            if (authCredential === null) {
                reject("arg.type should be one of LoginType.PASSWORD | LoginType.GOOGLE | LoginType.FACEBOOK");
                return;
            }
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
                        const loginResult = toLoginResult(user);
                        firebase.notifyAuthStateListeners({
                            loggedIn: true,
                            user: loginResult
                        });
                        resolve(loginResult);
                    }
                    else {
                        reject((task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                }
            });
            user.reauthenticate(authCredential).addOnCompleteListener(onCompleteListener);
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
            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
            if (user === null) {
                reject("no current user");
                return;
            }
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve();
                    }
                    else {
                        reject("Reload failed " + task.getException());
                    }
                }
            });
            user.reload().addOnCompleteListener(onCompleteListener);
        }
        catch (ex) {
            reject(ex);
        }
    });
};
firebase.sendPasswordResetEmail = (email) => {
    return new Promise((resolve, reject) => {
        try {
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve();
                    }
                    else {
                        reject("Sending password reset email failed");
                    }
                }
            });
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            firebaseAuth.sendPasswordResetEmail(email).addOnCompleteListener(onCompleteListener);
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
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve();
                    }
                    else {
                        reject("Updating email failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                }
            });
            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
            if (user === null) {
                reject("no current user");
            }
            else {
                user.updateEmail(newEmail).addOnCompleteListener(onCompleteListener);
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
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (task.isSuccessful()) {
                        resolve();
                    }
                    else {
                        reject("Updating password failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                }
            });
            const user = com.google.firebase.auth.FirebaseAuth.getInstance().getCurrentUser();
            if (user === null) {
                reject("no current user");
            }
            else {
                user.updatePassword(newPassword).addOnCompleteListener(onCompleteListener);
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
            if (!arg.email || !arg.password) {
                reject("Creating a user requires an email and password argument");
            }
            else {
                const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
                const onCompleteListener = new gmsTasks.OnCompleteListener({
                    onComplete: task => {
                        if (!task.isSuccessful()) {
                            reject("Creating a user failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        }
                        else {
                            const user = task.getResult().getUser();
                            const additionalUserInfo = task.getResult().getAdditionalUserInfo();
                            resolve(toLoginResult(user, additionalUserInfo));
                        }
                    }
                });
                firebaseAuth.createUserWithEmailAndPassword(arg.email, arg.password).addOnCompleteListener(onCompleteListener);
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
            const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
            const user = firebaseAuth.getCurrentUser();
            if (user === null) {
                reject("no current user");
                return;
            }
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        reject("Deleting a user failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                    }
                    else {
                        resolve();
                    }
                }
            });
            user.delete().addOnCompleteListener(onCompleteListener);
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
            if (!arg.displayName && !arg.photoURL) {
                reject("Updating a profile requires a displayName and / or a photoURL argument");
            }
            else {
                const firebaseAuth = com.google.firebase.auth.FirebaseAuth.getInstance();
                const user = firebaseAuth.getCurrentUser();
                if (user === null) {
                    reject("No current user");
                    return;
                }
                const onCompleteListener = new gmsTasks.OnCompleteListener({
                    onComplete: task => {
                        if (task.isSuccessful()) {
                            resolve();
                        }
                        else {
                            reject("Updating a profile failed. " + (task.getException() && task.getException().getReason ? task.getException().getReason() : task.getException()));
                        }
                    }
                });
                const profileUpdateBuilder = new com.google.firebase.auth.UserProfileChangeRequest.Builder();
                if (arg.displayName)
                    profileUpdateBuilder.setDisplayName(arg.displayName);
                if (arg.photoURL)
                    profileUpdateBuilder.setPhotoUri(android.net.Uri.parse(arg.photoURL));
                const profileUpdate = profileUpdateBuilder.build();
                user.updateProfile(profileUpdate).addOnCompleteListener(onCompleteListener);
            }
        }
        catch (ex) {
            console.log("Error in firebase.updateProfile: " + ex);
            reject(ex);
        }
    });
};
firebase.keepInSync = (path, switchOn) => {
    return new Promise((resolve, reject) => {
        try {
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const where = firebase.instance.child(path);
            where.keepSynced(switchOn);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.keepInSync: " + ex);
            reject(ex);
        }
    });
};
firebase._addObservers = (to, updateCallback) => {
    const listener = new com.google.firebase.database.ChildEventListener({
        onCancelled: databaseError => {
            updateCallback({
                error: databaseError.getMessage()
            });
        },
        onChildAdded: (snapshot, previousChildKey) => {
            updateCallback(firebase.getCallbackData('ChildAdded', snapshot));
        },
        onChildRemoved: snapshot => {
            updateCallback(firebase.getCallbackData('ChildRemoved', snapshot));
        },
        onChildChanged: (snapshot, previousChildKey) => {
            updateCallback(firebase.getCallbackData('ChildChanged', snapshot));
        },
        onChildMoved: (snapshot, previousChildKey) => {
            updateCallback(firebase.getCallbackData('ChildMoved', snapshot));
        }
    });
    to.addChildEventListener(listener);
    return listener;
};
firebase.addChildEventListener = (updateCallback, path) => {
    return new Promise((resolve, reject) => {
        try {
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            resolve({
                path: path,
                listeners: [firebase._addObservers(firebase.instance.child(path), updateCallback)]
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const listener = new com.google.firebase.database.ValueEventListener({
                onDataChange: snapshot => {
                    updateCallback(firebase.getCallbackData('ValueChanged', snapshot));
                },
                onCancelled: databaseError => {
                    updateCallback({
                        error: databaseError.getMessage()
                    });
                }
            });
            firebase.instance.child(path).addValueEventListener(listener);
            resolve({
                path: path,
                listeners: [listener]
            });
        }
        catch (ex) {
            console.log("Error in firebase.addValueEventListener: " + ex);
            reject(ex);
        }
    });
};
firebase.getValue = path => {
    return new Promise((resolve, reject) => {
        try {
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const listener = new com.google.firebase.database.ValueEventListener({
                onDataChange: snapshot => {
                    resolve(firebase.getCallbackData('ValueChanged', snapshot));
                },
                onCancelled: databaseError => {
                    reject(databaseError.getMessage());
                }
            });
            firebase.instance.child(path).addListenerForSingleValueEvent(listener);
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const ref = firebase.instance.child(path);
            for (let i = 0; i < listeners.length; i++) {
                const listener = listeners[i];
                ref.removeEventListener(listener);
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const pushInstance = firebase.instance.child(path).push();
            pushInstance.setValue(firebase.toValue(val))
                .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve({ key: pushInstance.getKey() })
            }))
                .addOnFailureListener(new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            firebase.instance.child(path).setValue(firebase.toValue(val))
                .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            }))
                .addOnFailureListener(new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            const onSuccessListener = new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            });
            const onFailureListener = new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            if (typeof val === "object") {
                firebase.instance.child(path).updateChildren(firebase.toHashMap(val))
                    .addOnSuccessListener(onSuccessListener)
                    .addOnFailureListener(onFailureListener);
            }
            else {
                const lastPartOfPath = path.lastIndexOf("/");
                const pathPrefix = path.substring(0, lastPartOfPath);
                const pathSuffix = path.substring(lastPartOfPath + 1);
                const updateObject = '{"' + pathSuffix + '" : "' + val + '"}';
                firebase.instance.child(pathPrefix).updateChildren(firebase.toHashMap(JSON.parse(updateObject)))
                    .addOnSuccessListener(onSuccessListener)
                    .addOnFailureListener(onFailureListener);
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            let query;
            if (options.orderBy.type === firebase.QueryOrderByType.KEY) {
                query = firebase.instance.child(path).orderByKey();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.VALUE) {
                query = firebase.instance.child(path).orderByValue();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.PRIORITY) {
                query = firebase.instance.child(path).orderByPriority();
            }
            else if (options.orderBy.type === firebase.QueryOrderByType.CHILD) {
                if (options.orderBy.value === undefined || options.orderBy.value === null) {
                    reject("When orderBy.type is 'child' you must set orderBy.value as well.");
                    return;
                }
                query = firebase.instance.child(path).orderByChild(options.orderBy.value);
            }
            else {
                reject("Invalid orderBy.type, use constants like firebase.QueryOrderByType.VALUE");
                return;
            }
            if (options.range && options.range.type) {
                if (options.range.type === firebase.QueryRangeType.START_AT) {
                    query = query.startAt(options.range.value);
                }
                else if (options.range.type === firebase.QueryRangeType.END_AT) {
                    query = query.endAt(options.range.value);
                }
                else if (options.range.type === firebase.QueryRangeType.EQUAL_TO) {
                    query = query.equalTo(options.range.value);
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
                        query = query.startAt(range.value);
                    }
                    else if (range.type === firebase.QueryRangeType.END_AT) {
                        query = query.endAt(range.value);
                    }
                    else if (range.type === firebase.QueryRangeType.EQUAL_TO) {
                        query = query.equalTo(range.value);
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
                    query = query.limitToFirst(options.limit.value);
                }
                else if (options.limit.type === firebase.QueryLimitType.LAST) {
                    query = query.limitToLast(options.limit.value);
                }
                else {
                    reject("Invalid limit.type, use constants like firebase.QueryLimitType.FIRST");
                    return;
                }
            }
            if (options.singleEvent) {
                const listener = new com.google.firebase.database.ValueEventListener({
                    onDataChange: snapshot => {
                        const result = {
                            type: "ValueChanged",
                            key: snapshot.getKey(),
                            value: {},
                            children: []
                        };
                        for (let iterator = snapshot.getChildren().iterator(); iterator.hasNext();) {
                            const snap = iterator.next();
                            const val = firebase.toJsObject(snap.getValue());
                            result.value[snap.getKey()] = val;
                            result.children.push(val);
                        }
                        if (updateCallback)
                            updateCallback(result);
                        resolve(result);
                    },
                    onCancelled: databaseError => {
                        if (updateCallback)
                            updateCallback({
                                error: databaseError.getMessage()
                            });
                        resolve({
                            error: databaseError.getMessage()
                        });
                    }
                });
                query.addListenerForSingleValueEvent(listener);
            }
            else {
                resolve({
                    path: path,
                    listeners: [firebase._addObservers(query, updateCallback)]
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
            if (firebase.instance === null) {
                reject("Run init() first!");
                return;
            }
            firebase.instance.child(path).setValue(null)
                .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            }))
                .addOnFailureListener(new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
        }
        catch (ex) {
            console.log("Error in firebase.remove: " + ex);
            reject(ex);
        }
    });
};
class OnDisconnect {
    constructor(disconnectInstance) {
        this.disconnectInstance = disconnectInstance;
    }
    cancel() {
        return new Promise((resolve, reject) => {
            try {
                this.disconnectInstance.cancel()
                    .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                    onSuccess: () => resolve()
                }))
                    .addOnFailureListener(new gmsTasks.OnFailureListener({
                    onFailure: exception => reject(exception.getMessage())
                }));
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
                this.disconnectInstance.removeValue()
                    .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                    onSuccess: () => resolve()
                }))
                    .addOnFailureListener(new gmsTasks.OnFailureListener({
                    onFailure: exception => reject(exception.getMessage())
                }));
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
                this.disconnectInstance.setValue(firebase.toValue(value))
                    .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                    onSuccess: () => resolve()
                }))
                    .addOnFailureListener(new gmsTasks.OnFailureListener({
                    onFailure: exception => reject(exception.getMessage())
                }));
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
                this.disconnectInstance.setValue(firebase.toValue(value), priority)
                    .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                    onSuccess: () => resolve()
                }))
                    .addOnFailureListener(new gmsTasks.OnFailureListener({
                    onFailure: exception => reject(exception.getMessage())
                }));
            }
            catch (ex) {
                console.log("Error in firebase.onDisconnect.setWithPriority: " + ex);
                reject(ex);
            }
        });
    }
    update(values, onComplete) {
        return new Promise((resolve, reject) => {
            try {
                this.disconnectInstance.updateChildren(firebase.toHashMap(values))
                    .addOnSuccessListener(new gmsTasks.OnSuccessListener({
                    onSuccess: () => resolve()
                }))
                    .addOnFailureListener(new gmsTasks.OnFailureListener({
                    onFailure: exception => reject(exception.getMessage())
                }));
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
    const disconnectInstance = firebase.instance.child(path).onDisconnect();
    return new OnDisconnect(disconnectInstance);
};
firebase.transaction = (path, transactionUpdate, onComplete) => {
    return new Promise((resolve, reject) => {
        if (!firebase.initialized) {
            console.error("Please run firebase.init() before firebase.transaction()");
            throw new Error("FirebaseApp is not initialized. Make sure you run firebase.init() first");
        }
        const dbRef = firebase.instance.child(path);
        const handler = new com.google.firebase.database.Transaction.Handler({
            doTransaction: (mutableData) => {
                const desiredValue = transactionUpdate(firebase.toJsObject(mutableData.getValue()));
                if (desiredValue === undefined) {
                    return com.google.firebase.database.Transaction.success(mutableData);
                }
                mutableData.setValue(firebase.toValue(desiredValue));
                return com.google.firebase.database.Transaction.success(mutableData);
            },
            onComplete: (databaseError, commited, snapshot) => {
                databaseError !== null ? reject(databaseError.getMessage()) :
                    resolve({ committed: commited, snapshot: nativeSnapshotToWebSnapshot(snapshot) });
            }
        });
        dbRef.runTransaction(handler);
    });
};
function nativeSnapshotToWebSnapshot(snapshot) {
    function forEach(action) {
        let innerSnapshot;
        for (let iterator = snapshot.getChildren().iterator(); iterator.hasNext();) {
            innerSnapshot = nativeSnapshotToWebSnapshot(iterator.next());
            if (action(innerSnapshot)) {
                return true;
            }
        }
        return false;
    }
    return {
        key: snapshot.getKey(),
        ref: snapshot.getRef(),
        child: (path) => nativeSnapshotToWebSnapshot(snapshot.child(path)),
        exists: () => snapshot.exists(),
        forEach: (func) => forEach(func),
        getPriority: () => firebase.toJsObject(snapshot.getPriority()),
        hasChild: (path) => snapshot.hasChild(path),
        hasChildren: () => snapshot.hasChildren(),
        numChildren: () => snapshot.getChildrenCount(),
        toJSON: () => firebase.toJsObject(snapshot.toString()),
        val: () => firebase.toJsObject(snapshot.getValue())
    };
}
firebase.enableLogging = (logging, persistent) => {
    if (logging) {
        com.google.firebase.database.FirebaseDatabase.getInstance().setLogLevel(com.google.firebase.database.Logger.Level.DEBUG);
    }
    else {
        com.google.firebase.database.FirebaseDatabase.getInstance().setLogLevel(com.google.firebase.database.Logger.Level.NONE);
    }
};
const ensureFirestore = () => {
    if (typeof (com.google.firebase.firestore) === "undefined") {
        throw new Error("Make sure 'firestore' is enabled in 'firebase.nativescript.json', then clean the node_modules and platforms folders");
    }
};
class FirestoreWriteBatch {
    constructor() {
        this.set = (documentRef, data, options) => {
            if (options && options.merge) {
                this.nativeWriteBatch.set(documentRef.android, firebase.toValue(data), com.google.firebase.firestore.SetOptions.merge());
            }
            else {
                this.nativeWriteBatch.set(documentRef.android, firebase.toValue(data));
            }
            return this;
        };
        this.delete = (documentRef) => {
            this.nativeWriteBatch.delete(documentRef.android);
            return this;
        };
    }
    update(documentRef, data) {
        this.nativeWriteBatch.update(documentRef.android, firebase.toValue(data));
        return this;
    }
    commit() {
        return new Promise((resolve, reject) => {
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        const ex = task.getException();
                        reject(ex && ex.getReason ? ex.getReason() : ex);
                    }
                    else {
                        resolve();
                    }
                }
            });
            this.nativeWriteBatch.commit().addOnCompleteListener(onCompleteListener);
        });
    }
}
firebase.firestore.batch = () => {
    const batch = new FirestoreWriteBatch();
    batch.nativeWriteBatch = com.google.firebase.firestore.FirebaseFirestore.getInstance().batch();
    return batch;
};
firebase.firestore.runTransaction = (updateFunction) => {
    return new Promise((resolve, reject) => {
        reject("Not supported on Android. If you need a x-platform implementation, use 'batch' instead.");
    });
};
firebase.firestore.settings = (settings) => {
    if (typeof (com.google.firebase.firestore) !== "undefined") {
        try {
            const builder = new com.google.firebase.firestore.FirebaseFirestoreSettings.Builder();
            (settings.cacheSizeBytes !== undefined) && builder.setCacheSizeBytes(long(settings.cacheSizeBytes));
            (settings.ssl !== undefined) && builder.setSslEnabled(settings.ssl);
            (settings.host !== undefined) && builder.setHost(settings.host);
            (initializeArguments.persist !== undefined) && builder.setPersistenceEnabled(initializeArguments.persist);
            com.google.firebase.firestore.FirebaseFirestore.getInstance().setFirestoreSettings(builder.build());
        }
        catch (err) {
            console.log("Error in firebase.firestore.settings: " + err);
        }
    }
};
firebase.firestore.clearPersistence = () => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
        const onSuccessListener = new gmsTasks.OnSuccessListener({
            onSuccess: () => resolve()
        });
        const onFailureListener = new gmsTasks.OnFailureListener({
            onFailure: exception => reject(exception.getMessage())
        });
        db.clearPersistence()
            .addOnSuccessListener(onSuccessListener)
            .addOnFailureListener(onFailureListener);
    });
};
firebase.firestore.collection = (collectionPath) => {
    ensureFirestore();
    try {
        if (!firebase.initialized) {
            console.log("Please run firebase.init() before firebase.firestore.collection()");
            return null;
        }
        const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
        return firebase.firestore._getCollectionReference(db.collection(collectionPath));
    }
    catch (ex) {
        console.log("Error in firebase.firestore.collection: " + ex);
        return null;
    }
};
firebase.firestore.collectionGroup = (id) => {
    ensureFirestore();
    try {
        const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
        return firebase.firestore._getCollectionGroupQuery(db.collectionGroup(id));
    }
    catch (ex) {
        console.log("Error in firebase.firestore.collectionGroup: " + ex);
        return null;
    }
};
firebase.firestore.onDocumentSnapshot = (docRef, optionsOrCallback, callbackOrOnError, onError) => {
    let options = com.google.firebase.firestore.MetadataChanges.EXCLUDE;
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
    if (optionsOrCallback.includeMetadataChanges) {
        options = com.google.firebase.firestore.MetadataChanges.INCLUDE;
    }
    const listener = docRef.addSnapshotListener(options, new com.google.firebase.firestore.EventListener({
        onEvent: ((snapshot, exception) => {
            if (exception !== null) {
                const error = "onDocumentSnapshot error code: " + exception.getCode();
                onErrorCallback && onErrorCallback(new Error(error));
                return;
            }
            onNextCallback && onNextCallback(new DocumentSnapshot(snapshot));
        })
    }));
    return () => listener.remove();
};
firebase.firestore.onCollectionSnapshot = (colRef, optionsOrCallback, callbackOrOnError, onError) => {
    let options = com.google.firebase.firestore.MetadataChanges.EXCLUDE;
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
    if (optionsOrCallback.includeMetadataChanges) {
        options = com.google.firebase.firestore.MetadataChanges.INCLUDE;
    }
    const listener = colRef.addSnapshotListener(options, new com.google.firebase.firestore.EventListener({
        onEvent: ((snapshot, exception) => {
            if (exception !== null) {
                const error = "onCollectionSnapshot error code: " + exception.getCode();
                onErrorCallback && onErrorCallback(new Error(error));
                return;
            }
            onNextCallback && onNextCallback(new QuerySnapshot(snapshot));
        })
    }));
    return () => listener.remove();
};
firebase.firestore._getDocumentReference = (docRef) => {
    if (!docRef) {
        return null;
    }
    const collectionPath = docRef.getParent().getPath();
    return {
        discriminator: "docRef",
        id: docRef.getId(),
        parent: firebase.firestore._getCollectionReference(docRef.getParent()),
        path: docRef.getPath(),
        firestore: firebase.firestore,
        collection: cp => firebase.firestore.collection(`${collectionPath}/${docRef.getId()}/${cp}`),
        set: (data, options) => firebase.firestore.set(collectionPath, docRef.getId(), data, options),
        get: (options) => firebase.firestore.getDocument(collectionPath, docRef.getId(), options),
        update: (data) => firebase.firestore.update(collectionPath, docRef.getId(), data),
        delete: () => firebase.firestore.delete(collectionPath, docRef.getId()),
        onSnapshot: (optionsOrCallback, callbackOrOnError, onError) => firebase.firestore.onDocumentSnapshot(docRef, optionsOrCallback, callbackOrOnError, onError),
        android: docRef
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
firebase.firestore._getCollectionReference = (colRef) => {
    if (!colRef) {
        return null;
    }
    const collectionPath = colRef.getPath();
    return {
        id: colRef.getId(),
        parent: firebase.firestore._getDocumentReference(colRef.getParent()),
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
firebase.firestore.doc = (collectionPath, documentPath) => {
    ensureFirestore();
    try {
        if (!firebase.initialized) {
            console.log("Please run firebase.init() before firebase.firestore.doc()");
            return null;
        }
        const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
        const colRef = db.collection(collectionPath);
        const docRef = documentPath ? colRef.document(documentPath) : colRef.document();
        return firebase.firestore._getDocumentReference(docRef);
    }
    catch (ex) {
        console.log("Error in firebase.firestore.doc: " + ex);
        return null;
    }
};
firebase.firestore.docRef = (documentPath) => {
    ensureFirestore();
    const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
    return firebase.firestore._getDocumentReference(db.document(documentPath));
};
firebase.firestore.add = (collectionPath, document) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onSuccessListener = new gmsTasks.OnSuccessListener({
                onSuccess: (docRef) => {
                    resolve(firebase.firestore._getDocumentReference(docRef));
                }
            });
            const onFailureListener = new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            db.collection(collectionPath)
                .add(firebase.toValue(document))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
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
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onSuccessListener = new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            });
            const onFailureListener = new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            const docRef = db.collection(collectionPath).document(documentPath);
            if (options && options.merge) {
                docRef
                    .set(firebase.toValue(document), com.google.firebase.firestore.SetOptions.merge())
                    .addOnSuccessListener(onSuccessListener)
                    .addOnFailureListener(onFailureListener);
            }
            else {
                docRef
                    .set(firebase.toValue(document))
                    .addOnSuccessListener(onSuccessListener)
                    .addOnFailureListener(onFailureListener);
            }
        }
        catch (ex) {
            console.log("Error in firebase.firestore.set: " + ex);
            reject(ex);
        }
    });
};
firebase.firestore.update = (collectionPath, documentPath, document) => {
    ensureFirestore();
    return new Promise((resolve, reject) => {
        try {
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onSuccessListener = new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            });
            const onFailureListener = new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            const docRef = db.collection(collectionPath).document(documentPath);
            docRef
                .update(firebase.toValue(document))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
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
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onSuccessListener = new gmsTasks.OnSuccessListener({
                onSuccess: () => resolve()
            });
            const onFailureListener = new gmsTasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            const docRef = db.collection(collectionPath).document(documentPath);
            docRef
                .delete()
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
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
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        const ex = task.getException();
                        reject(ex && ex.getReason ? ex.getReason() : ex);
                    }
                    else {
                        const result = task.getResult();
                        resolve(new QuerySnapshot(result));
                    }
                }
            });
            let source = com.google.firebase.firestore.Source.DEFAULT;
            if (options && options.source) {
                if (options.source === "cache") {
                    source = com.google.firebase.firestore.Source.CACHE;
                }
                else if (options.source === "server") {
                    source = com.google.firebase.firestore.Source.SERVER;
                }
            }
            db.collection(collectionPath)
                .get(source)
                .addOnCompleteListener(onCompleteListener);
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
            const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: task => {
                    if (!task.isSuccessful()) {
                        const ex = task.getException();
                        reject(ex && ex.getReason ? ex.getReason() : ex);
                    }
                    else {
                        const result = task.getResult();
                        resolve(new DocumentSnapshot(result));
                    }
                }
            });
            let source = com.google.firebase.firestore.Source.DEFAULT;
            if (options && options.source) {
                if (options.source === "cache") {
                    source = com.google.firebase.firestore.Source.CACHE;
                }
                else if (options.source === "server") {
                    source = com.google.firebase.firestore.Source.SERVER;
                }
            }
            db.collection(collectionPath)
                .document(documentPath)
                .get(source)
                .addOnCompleteListener(onCompleteListener);
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
            const onCompleteListener = new gmsTasks.OnCompleteListener({
                onComplete: (task) => {
                    if (!task.isSuccessful()) {
                        const ex = task.getException();
                        reject(ex && ex.getReason ? ex.getReason() : ex);
                    }
                    else {
                        const result = task.getResult();
                        resolve(new QuerySnapshot(result));
                    }
                }
            });
            query.get().addOnCompleteListener(onCompleteListener);
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
        const db = com.google.firebase.firestore.FirebaseFirestore.getInstance();
        query = query || db.collection(collectionPath);
        if (opStr === "<") {
            query = query.whereLessThan(fieldPath, firebase.toValue(value));
        }
        else if (opStr === "<=") {
            query = query.whereLessThanOrEqualTo(fieldPath, firebase.toValue(value));
        }
        else if (opStr === "==") {
            query = query.whereEqualTo(fieldPath, firebase.toValue(value));
        }
        else if (opStr === ">=") {
            query = query.whereGreaterThanOrEqualTo(fieldPath, firebase.toValue(value));
        }
        else if (opStr === ">") {
            query = query.whereGreaterThan(fieldPath, firebase.toValue(value));
        }
        else if (opStr === "in") {
            query = query.whereIn(fieldPath, firebase.toValue(value));
        }
        else if (opStr === "array-contains") {
            query = query.whereArrayContains(fieldPath, firebase.toValue(value));
        }
        else if (opStr === "array-contains-any") {
            query = query.whereArrayContainsAny(fieldPath, firebase.toValue(value));
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
    query = query.orderBy(fieldPath, direction === "desc" ? com.google.firebase.firestore.Query.Direction.DESCENDING : com.google.firebase.firestore.Query.Direction.ASCENDING);
    return firebase.firestore._getQuery(collectionPath, query);
};
firebase.firestore.limit = (collectionPath, limit, query) => {
    query = query.limit(limit);
    return firebase.firestore._getQuery(collectionPath, query);
};
firebase.firestore.startAfter = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    return firebase.firestore._getQuery(collectionPath, query.startAfter(firebase.firestore._getSnapshotOrFieldValues(snapshotOrFieldValue, fieldValues)));
};
firebase.firestore.startAt = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    return firebase.firestore._getQuery(collectionPath, query.startAt(firebase.firestore._getSnapshotOrFieldValues(snapshotOrFieldValue, fieldValues)));
};
firebase.firestore.endAt = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    return firebase.firestore._getQuery(collectionPath, query.endAt(firebase.firestore._getSnapshotOrFieldValues(snapshotOrFieldValue, fieldValues)));
};
firebase.firestore.endBefore = (collectionPath, snapshotOrFieldValue, fieldValues, query) => {
    return firebase.firestore._getQuery(collectionPath, query.endBefore(firebase.firestore._getSnapshotOrFieldValues(snapshotOrFieldValue, fieldValues)));
};
firebase.firestore._getSnapshotOrFieldValues = (snapshotOrFieldValue, fieldValues) => {
    if (snapshotOrFieldValue && snapshotOrFieldValue.android) {
        return snapshotOrFieldValue.android;
    }
    else {
        const AllFieldValues = [snapshotOrFieldValue, ...fieldValues];
        const javaArray = Array.create('java.lang.Object', AllFieldValues.length);
        AllFieldValues.forEach((value, index) => {
            javaArray[index] = firebase.toValue(value);
        });
        return javaArray;
    }
};
function convertDocChangeType(type) {
    switch (type) {
        case com.google.firebase.firestore.DocumentChange.Type.ADDED:
            return 'added';
        case com.google.firebase.firestore.DocumentChange.Type.MODIFIED:
            return 'modified';
        case com.google.firebase.firestore.DocumentChange.Type.REMOVED:
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
            fromCache: this.snapshot.getMetadata().isFromCache(),
            hasPendingWrites: this.snapshot.getMetadata().hasPendingWrites()
        };
        this.docSnapshots = this.docs;
    }
    get docs() {
        const getSnapshots = () => {
            const docSnapshots = [];
            for (let i = 0; i < this.snapshot.size(); i++) {
                const documentSnapshot = this.snapshot.getDocuments().get(i);
                docSnapshots.push(new DocumentSnapshot(documentSnapshot));
            }
            this._docSnapshots = docSnapshots;
            return docSnapshots;
        };
        return this._docSnapshots || getSnapshots();
    }
    docChanges(options) {
        const docChanges = [];
        const jChanges = this.snapshot.getDocumentChanges();
        for (let i = 0; i < jChanges.size(); i++) {
            const chg = jChanges.get(i);
            const type = convertDocChangeType(chg.getType());
            const doc = convertDocument(chg.getDocument());
            docChanges.push({
                doc,
                newIndex: chg.getNewIndex(),
                oldIndex: chg.getOldIndex(),
                type,
            });
        }
        return docChanges;
    }
    forEach(callback, thisArg) {
        this.docSnapshots.map(snapshot => callback(snapshot));
    }
}
export * from './firebase-common';
//# sourceMappingURL=firebase.android.js.map