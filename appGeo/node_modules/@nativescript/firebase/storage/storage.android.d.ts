import { DeleteFileOptions, DownloadFileOptions, GetDownloadUrlOptions, ListOptions, UploadFileOptions, UploadFileResult } from "./storage";
import { ListResult as ListResultBase } from "./storage-common";
declare class ListResult extends ListResultBase {
    private listResult;
    private listOptions;
    android: com.google.firebase.storage.ListResult;
    constructor(listResult: com.google.firebase.storage.ListResult, listOptions: ListOptions);
}
export declare function uploadFile(arg: UploadFileOptions): Promise<UploadFileResult>;
export declare function downloadFile(arg: DownloadFileOptions): Promise<string>;
export declare function getDownloadUrl(arg: GetDownloadUrlOptions): Promise<string>;
export declare function deleteFile(arg: DeleteFileOptions): Promise<void>;
export declare function listAll(listOptions: ListOptions): Promise<ListResult>;
export {};
