import { File } from "@nativescript/core";
import { ListResult, UploadMetadata } from "../../storage/storage";
export declare module storage {
    interface UploadTaskSnapshot {
        downloadURL: string | null;
        totalBytes: number;
    }
    interface Metadata {
        string: string;
    }
    class Reference {
        private path;
        parent: Reference | null;
        root: Reference;
        fullPath: string;
        constructor(path?: string);
        child(path: string): storage.Reference;
        delete(): Promise<void>;
        getDownloadURL(): Promise<string>;
        getMetadata(): Promise<string>;
        listAll(): Promise<ListResult>;
        put(data: File | string, metadata?: UploadMetadata): Promise<UploadTaskSnapshot>;
        download(downloadToPath: string): Promise<any>;
    }
    class Storage {
        ref(): Reference;
    }
}
