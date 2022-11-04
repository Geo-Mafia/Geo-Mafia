import { firestore } from "./firebase";
export declare enum QueryOrderByType {
    KEY = 0,
    VALUE = 1,
    CHILD = 2,
    PRIORITY = 3
}
export declare enum QueryRangeType {
    START_AT = 0,
    END_AT = 1,
    EQUAL_TO = 2
}
export declare enum QueryLimitType {
    FIRST = 0,
    LAST = 1
}
declare type ActionCodeSettings = {
    url: string;
    handleCodeInApp?: boolean;
    android?: {
        installApp?: boolean;
        minimumVersion?: string;
        packageName: string;
    };
    iOS?: {
        bundleId: string;
        dynamicLinkDomain?: string;
    };
};
export interface OnDisconnectBase {
    cancel(): Promise<any>;
    remove(): Promise<any>;
    set(value: any): Promise<any>;
    setWithPriority(value: any, priority: number | string): Promise<any>;
    update(values: Object): Promise<any>;
}
export interface DataSnapshot {
    key: string;
    ref: any;
    child(path: string): DataSnapshot;
    exists(): boolean;
    forEach(action: (snapshot: DataSnapshot) => any): boolean;
    getPriority(): string | number | null;
    hasChild(path: string): boolean;
    hasChildren(): boolean;
    numChildren(): number;
    toJSON(): Object;
    val(): any;
}
export interface FBData {
    type: string;
    key: string;
    value: any;
}
export interface FBDataSingleEvent extends FBData {
    children?: Array<any>;
}
export interface FBErrorData {
    error: string;
}
export interface GetAuthTokenOptions {
    forceRefresh?: boolean;
}
export interface IdTokenResult {
    token: string;
    claims: {
        [key: string]: any;
    };
    signInProvider: string;
    expirationTime: number;
    issuedAtTime: number;
    authTime: number;
}
export interface QueryRangeOption {
    type: QueryRangeType;
    value: any;
}
export interface QueryOptions {
    orderBy: {
        type: QueryOrderByType;
        value?: string;
    };
    range?: QueryRangeOption;
    ranges?: QueryRangeOption[];
    limit?: {
        type: QueryLimitType;
        value: number;
    };
    singleEvent?: boolean;
}
export interface Provider {
    id: string;
    token?: string;
}
export interface User {
    uid: string;
    email?: string;
    emailVerified: boolean;
    displayName?: string;
    phoneNumber?: string;
    anonymous: boolean;
    isAnonymous: boolean;
    providers: Array<Provider>;
    photoURL?: string;
    metadata: UserMetadata;
    additionalUserInfo?: AdditionalUserInfo;
    refreshToken?: string;
    getIdToken(forceRefresh?: boolean): Promise<string>;
    getIdTokenResult(forceRefresh?: boolean): Promise<IdTokenResult>;
    sendEmailVerification(actionCodeSettings?: ActionCodeSettings): Promise<void>;
}
export interface UserMetadata {
    creationTimestamp: Date;
    lastSignInTimestamp: Date;
}
export interface AdditionalUserInfo {
    profile: Map<string, any>;
    providerId: string;
    username: string;
    isNewUser: boolean;
}
export declare class QuerySnapshot implements firestore.QuerySnapshot {
    private snapshot;
    private _docSnapshots;
    constructor(snapshot: FIRQuerySnapshot);
    metadata: {
        fromCache: boolean;
        hasPendingWrites: boolean;
    };
    get docs(): firestore.QueryDocumentSnapshot[];
    docSnapshots: firestore.DocumentSnapshot[];
    docChanges(options?: firestore.SnapshotListenOptions): firestore.DocumentChange[];
    forEach(callback: (result: firestore.DocumentSnapshot) => void, thisArg?: any): void;
}
export * from './firebase-common';
