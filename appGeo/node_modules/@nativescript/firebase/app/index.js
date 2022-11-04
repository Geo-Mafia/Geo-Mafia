import { firebase } from "../firebase";
import { auth as firebaseAuthModule } from "./auth";
import { database as firebaseDatabaseModule } from "./database";
import { firestore as firebaseFirestoreModule } from "./firestore";
import { storage as firebaseStorageModule } from "./storage";
import { functions as firebaseFunctionsModule } from "./functions";
export function initializeApp(options, name) {
    return firebase.init(options);
}
let authCache;
export function auth(app) {
    if (app) {
        console.log("The 'app' param is ignored at the moment.");
    }
    if (!authCache) {
        authCache = new firebaseAuthModule.Auth();
    }
    return authCache;
}
let dbCache;
export function database(app) {
    if (app) {
        console.log("The 'app' param is ignored at the moment.");
    }
    if (!dbCache) {
        dbCache = new firebaseDatabaseModule.Database();
    }
    return dbCache;
}
let firestoreCache;
export function firestore(app) {
    if (app) {
        console.log("The 'app' param is ignored at the moment.");
    }
    if (!firestoreCache) {
        firestoreCache = new firebaseFirestoreModule.Firestore();
    }
    return firestoreCache;
}
let functionsCache;
(function (database) {
    function enableLogging(logger, persistent) {
        firebase.enableLogging(logger, persistent);
    }
    database.enableLogging = enableLogging;
})(database || (database = {}));
export function functions(app) {
    if (app) {
        console.log("The 'app' param is ignored at the moment.");
    }
    if (!functionsCache) {
        functionsCache = new firebaseFunctionsModule.Functions();
    }
    return functionsCache;
}
let storageCache;
export function storage(app) {
    if (app) {
        console.log("The 'app' param is ignored at the moment.");
    }
    if (!storageCache) {
        storageCache = new firebaseStorageModule.Storage();
    }
    return storageCache;
}
//# sourceMappingURL=index.js.map