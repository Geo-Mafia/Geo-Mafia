import { File } from "@nativescript/core";
import * as firebaseStorage from "../../storage/storage";
export var storage;
(function (storage) {
    class Reference {
        constructor(path) {
            this.path = path;
            this.fullPath = this.path;
            if (path && path.length > 0) {
                this.root = new Reference();
            }
            else {
                this.root = this;
            }
        }
        child(path) {
            return new Reference(this.path ? `${this.path}/${path}` : path);
        }
        delete() {
            return firebaseStorage.deleteFile({
                remoteFullPath: this.path
            });
        }
        getDownloadURL() {
            return firebaseStorage.getDownloadUrl({
                remoteFullPath: this.path
            });
        }
        getMetadata() {
            return firebaseStorage.getDownloadUrl({
                remoteFullPath: this.path
            });
        }
        listAll() {
            return firebaseStorage.listAll({
                remoteFullPath: this.path
            });
        }
        put(data, metadata) {
            return new Promise((resolve, reject) => {
                firebaseStorage.uploadFile({
                    localFile: data instanceof File ? data : undefined,
                    localFullPath: !(data instanceof File) ? data : undefined,
                    remoteFullPath: this.path,
                    onProgress: progress => console.log(`Upload progress: ${progress.percentageCompleted}% completed`),
                    metadata
                }).then((result) => {
                    this.getDownloadURL()
                        .then(url => {
                        resolve({
                            downloadURL: url,
                            totalBytes: result.size
                        });
                    });
                }).catch(err => reject(err));
            });
        }
        download(downloadToPath) {
            return firebaseStorage.downloadFile({
                localFullPath: downloadToPath,
                remoteFullPath: this.path
            });
        }
    }
    storage.Reference = Reference;
    class Storage {
        ref() {
            return new Reference();
        }
    }
    storage.Storage = Storage;
})(storage || (storage = {}));
//# sourceMappingURL=index.js.map