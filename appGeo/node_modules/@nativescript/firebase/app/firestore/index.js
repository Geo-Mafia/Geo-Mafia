import { firestore as fStore } from "../../firebase";
export var firestore;
(function (firestore) {
    class Firestore {
        collection(collectionPath) {
            return fStore.collection(collectionPath);
        }
        collectionGroup(id) {
            return fStore.collectionGroup(id);
        }
        doc(path) {
            return fStore.docRef(path);
        }
        FieldValue() {
            return {
                type: undefined,
                value: undefined,
                serverTimestamp: () => "SERVER_TIMESTAMP",
                delete: () => "DELETE_FIELD",
                arrayUnion: (...elements) => new fStore.FieldValue("ARRAY_UNION", elements),
                arrayRemove: (...elements) => new fStore.FieldValue("ARRAY_REMOVE", elements),
                increment: (n) => new fStore.FieldValue("INCREMENT", n)
            };
        }
        GeoPoint(latitude, longitude) {
            return fStore.GeoPoint(latitude, longitude);
        }
        runTransaction(updateFunction) {
            return fStore.runTransaction(updateFunction);
        }
        batch() {
            return fStore.batch();
        }
        settings(settings) {
            fStore.settings(settings);
        }
        clearPersistence() {
            return fStore.clearPersistence();
        }
    }
    firestore.Firestore = Firestore;
})(firestore || (firestore = {}));
//# sourceMappingURL=index.js.map