import { firebase } from "../firebase-common";
import { ListResult as ListResultBase } from "./storage-common";
function getReference(nativeReference, listOptions) {
    return {
        ios: nativeReference,
        bucket: nativeReference.bucket,
        name: nativeReference.name,
        fullPath: nativeReference.fullPath,
        listAll: () => listAll({ remoteFullPath: nativeReference.fullPath, bucket: listOptions.bucket })
    };
}
function getReferences(nativeReferences, listOptions) {
    const references = [];
    for (let i = 0, l = nativeReferences.count; i < l; i++) {
        const ref = nativeReferences.objectAtIndex(i);
        references.push(getReference(ref, listOptions));
    }
    return references;
}
class ListResult extends ListResultBase {
    constructor(listResult, listOptions) {
        super(getReferences(listResult.items, listOptions), getReferences(listResult.prefixes, listOptions), listResult.pageToken);
        this.listResult = listResult;
        this.listOptions = listOptions;
        this.ios = listResult;
        delete this.listResult;
        delete this.listOptions;
    }
}
function getStorageRef(reject, arg) {
    if (typeof (FIRStorage) === "undefined") {
        reject("Uncomment Storage in the plugin's Podfile first");
        return undefined;
    }
    if (!arg.remoteFullPath) {
        reject("remoteFullPath is mandatory");
        return undefined;
    }
    if (arg.bucket) {
        return FIRStorage.storage().referenceForURL(arg.bucket);
    }
    else if (firebase.storageBucket) {
        return firebase.storageBucket;
    }
    else {
        return FIRStorage.storage().reference();
    }
}
export function uploadFile(arg) {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = (metadata, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve({
                        name: metadata.name,
                        contentType: metadata.contentType,
                        created: metadata.timeCreated,
                        updated: metadata.updated,
                        bucket: metadata.bucket,
                        size: metadata.size
                    });
                }
            };
            const storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            const fIRStorageReference = storageRef.child(arg.remoteFullPath);
            let fIRStorageUploadTask = null;
            let metadata = null;
            if (arg.metadata) {
                metadata = FIRStorageMetadata.new();
                metadata.cacheControl = arg.metadata.cacheControl;
                metadata.contentDisposition = arg.metadata.contentDisposition;
                metadata.contentEncoding = arg.metadata.contentEncoding;
                metadata.contentLanguage = arg.metadata.contentLanguage;
                metadata.contentType = arg.metadata.contentType;
                if (arg.metadata.customMetadata) {
                    const customMetadata = NSMutableDictionary.new();
                    for (let p in arg.metadata.customMetadata) {
                        customMetadata.setObjectForKey(arg.metadata.customMetadata[p], p);
                    }
                    metadata.customMetadata = customMetadata;
                }
            }
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFile.path), metadata, onCompletion);
            }
            else if (arg.localFullPath) {
                fIRStorageUploadTask = fIRStorageReference.putFileMetadataCompletion(NSURL.fileURLWithPath(arg.localFullPath), metadata, onCompletion);
            }
            else {
                reject("One of localFile or localFullPath is required");
                return;
            }
            if (fIRStorageUploadTask !== null) {
                fIRStorageUploadTask.observeStatusHandler(2, snapshot => {
                    if (!snapshot.error && typeof (arg.onProgress) === "function") {
                        arg.onProgress({
                            fractionCompleted: snapshot.progress.fractionCompleted,
                            percentageCompleted: Math.round(snapshot.progress.fractionCompleted * 100)
                        });
                    }
                });
            }
        }
        catch (ex) {
            console.log("Error in firebase.uploadFile: " + ex);
            reject(ex);
        }
    });
}
export function downloadFile(arg) {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = (url, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(url.absoluteString);
                }
            };
            const storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            const fIRStorageReference = storageRef.child(arg.remoteFullPath);
            let localFilePath;
            if (arg.localFile) {
                if (typeof (arg.localFile) !== "object") {
                    reject("localFile argument must be a File object; use file-system module to create one");
                    return;
                }
                localFilePath = arg.localFile.path;
            }
            else if (arg.localFullPath) {
                localFilePath = arg.localFullPath;
            }
            else {
                reject("One of localFile or localFullPath is required");
                return;
            }
            const localFileUrl = NSURL.fileURLWithPath(localFilePath);
            fIRStorageReference.writeToFileCompletion(localFileUrl, onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.downloadFile: " + ex);
            reject(ex);
        }
    });
}
export function getDownloadUrl(arg) {
    return new Promise((resolve, reject) => {
        try {
            const onCompletion = (url, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(url.absoluteString);
                }
            };
            const storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            const fIRStorageReference = storageRef.child(arg.remoteFullPath);
            fIRStorageReference.downloadURLWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.getDownloadUrl: " + ex);
            reject(ex);
        }
    });
}
export function deleteFile(arg) {
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
            const storageRef = getStorageRef(reject, arg);
            if (!storageRef) {
                return;
            }
            const fIRStorageFileRef = storageRef.child(arg.remoteFullPath);
            fIRStorageFileRef.deleteWithCompletion(onCompletion);
        }
        catch (ex) {
            console.log("Error in firebase.deleteFile: " + ex);
            reject(ex);
        }
    });
}
export function listAll(listOptions) {
    return new Promise((resolve, reject) => {
        try {
            const storageRef = getStorageRef(reject, listOptions);
            if (!storageRef) {
                return;
            }
            const fIRStorageReference = storageRef.child(listOptions.remoteFullPath);
            fIRStorageReference.listAllWithCompletion((result, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(new ListResult(result, listOptions));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.listAll: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=storage.ios.js.map