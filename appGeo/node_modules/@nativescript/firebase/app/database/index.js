import { firebase } from "../../firebase";
import { nextPushId } from "./util/NextPushId";
export var database;
(function (database) {
    class Query {
        constructor(path) {
            this.path = path;
        }
        on(eventType, callback, cancelCallbackOrContext, context) {
            const onValueEvent = result => {
                if (result.error) {
                    callback(result);
                }
                else {
                    callback({
                        key: result.key,
                        val: () => result.value,
                        exists: () => !!result.value
                    });
                }
            };
            firebase.addValueEventListener(onValueEvent, this.path).then((result) => {
                if (!Query.registeredListeners.has(this.path)) {
                    Query.registeredListeners.set(this.path, []);
                }
                Query.registeredListeners.set(this.path, Query.registeredListeners.get(this.path).concat(result.listeners));
            }, error => {
                console.log("firebase.database().on error: " + error);
            });
            if (!Query.registeredCallbacks.has(this.path)) {
                Query.registeredCallbacks.set(this.path, []);
            }
            Query.registeredCallbacks.get(this.path).push(callback);
            return null;
        }
        off(eventType, callback, context) {
            if (Query.registeredListeners.has(this.path)) {
                firebase.removeEventListeners(Query.registeredListeners.get(this.path), this.path).then(result => Query.registeredListeners.delete(this.path), error => console.log("firebase.database().off error: " + error));
            }
            Query.registeredCallbacks.delete(this.path);
            return null;
        }
        once(eventType, successCallback, failureCallbackOrContext, context) {
            return new Promise((resolve, reject) => {
                firebase.getValue(this.path).then(result => {
                    resolve({
                        key: result.key,
                        val: () => result.value,
                        exists: () => !!result.value
                    });
                });
            });
        }
        getOnValueEventHandler() {
            return result => {
                const callbacks = Query.registeredCallbacks.get(this.path);
                callbacks && callbacks.map(callback => {
                    callback({
                        key: result.key,
                        val: () => result.value,
                        exists: () => !!result.value
                    });
                });
            };
        }
        orderByChild(child) {
            firebase.query(this.getOnValueEventHandler(), this.path, {
                orderBy: {
                    type: firebase.QueryOrderByType.CHILD,
                    value: child
                }
            });
            return this;
        }
        orderByKey() {
            firebase.query(this.getOnValueEventHandler(), this.path, {
                orderBy: {
                    type: firebase.QueryOrderByType.KEY
                }
            });
            return this;
        }
        orderByPriority() {
            firebase.query(this.getOnValueEventHandler(), this.path, {
                orderBy: {
                    type: firebase.QueryOrderByType.PRIORITY
                }
            });
            return this;
        }
        orderByValue() {
            firebase.query(this.getOnValueEventHandler(), this.path, {
                orderBy: {
                    type: firebase.QueryOrderByType.VALUE
                }
            });
            return this;
        }
    }
    Query.registeredListeners = new Map();
    Query.registeredCallbacks = new Map();
    database.Query = Query;
    class Reference extends Query {
        getKey() {
            if (!this.path) {
                return null;
            }
            else {
                return this.path.lastIndexOf("/") === -1 ? this.path : this.path.substring(this.path.lastIndexOf("/") + 1);
            }
        }
        get key() {
            return this.getKey();
        }
        set(value, onComplete) {
            return new Promise((resolve, reject) => {
                firebase.setValue(this.path, value).then(() => {
                    onComplete && onComplete(null);
                    resolve(null);
                }).catch(err => {
                    onComplete && onComplete(err);
                    reject(err);
                });
            });
        }
        child(path) {
            return new Reference(this.path ? `${this.path}/${path}` : path);
        }
        push(value, onComplete) {
            const now = new Date().getTime();
            const name = nextPushId(now);
            const thennablePushRef = this.child(name);
            const pushRef = this.child(name);
            let promise;
            if (value != null) {
                promise = thennablePushRef.set(value, onComplete).then(() => pushRef);
            }
            else {
                promise = Promise.resolve(pushRef);
            }
            thennablePushRef.then = promise.then.bind(promise);
            thennablePushRef.catch = promise.then.bind(promise, undefined);
            if (typeof onComplete === 'function') {
                promise.catch(() => {
                });
            }
            return thennablePushRef;
        }
        remove(onComplete) {
            return new Promise((resolve, reject) => {
                firebase.remove(this.path).then(() => {
                    onComplete && onComplete(null);
                    resolve(null);
                }).catch(err => {
                    onComplete && onComplete(err);
                    reject(err);
                });
            });
        }
        onDisconnect() {
            return firebase.onDisconnect(this.path);
        }
        transaction(transactionUpdate, onComplete, applyLocally) {
            return firebase.transaction(this.path, transactionUpdate, onComplete);
        }
    }
    database.Reference = Reference;
    class Database {
        ref(path) {
            return new Reference(path);
        }
    }
    database.Database = Database;
})(database || (database = {}));
//# sourceMappingURL=index.js.map