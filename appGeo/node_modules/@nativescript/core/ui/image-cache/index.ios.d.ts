import * as common from './image-cache-common';
export declare class Cache extends common.Cache {
    private _cache;
    private _memoryWarningHandler;
    constructor();
    _downloadCore(request: common.DownloadRequest): void;
    get(key: string): any;
    set(key: string, image: any): void;
    remove(key: string): void;
    clear(): void;
}
