import { firestore as fsNamespace } from "./firebase";
export declare class FieldValue {
    type: fsNamespace.FieldValueType;
    value: any;
    constructor(type: fsNamespace.FieldValueType, value: any);
    static serverTimestamp: () => string;
    static delete: () => string;
    static arrayUnion: (...elements: any[]) => FieldValue;
    static arrayRemove: (...elements: any[]) => FieldValue;
    static increment: (n: number) => FieldValue;
}
export declare class GeoPoint {
    latitude: number;
    longitude: number;
    constructor(latitude: number, longitude: number);
}
export declare const firebase: any;
export declare const firestore: any;
export declare abstract class DocumentSnapshot {
    id: string;
    exists: boolean;
    ref: firebase.firestore.DocumentReference;
    data: () => firebase.firestore.DocumentData;
    constructor(id: string, exists: boolean, documentData: firebase.firestore.DocumentData, ref: firebase.firestore.DocumentReference);
}
export declare function isDocumentReference(object: any): object is firebase.firestore.DocumentReference;
