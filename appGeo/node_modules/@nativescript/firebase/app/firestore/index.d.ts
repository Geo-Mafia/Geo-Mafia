import { firestore as fStore } from "../../firebase";
export declare namespace firestore {
    class Firestore {
        collection(collectionPath: string): fStore.CollectionReference;
        collectionGroup(id: string): fStore.CollectionGroup;
        doc(path: string): fStore.DocumentReference;
        FieldValue(): firebase.firestore.FieldValue;
        GeoPoint(latitude: number, longitude: number): fStore.GeoPoint;
        runTransaction<T>(updateFunction: (transaction: fStore.Transaction) => Promise<any>): Promise<void>;
        batch(): fStore.WriteBatch;
        settings(settings: fStore.Settings): void;
        clearPersistence(): Promise<void>;
    }
}
