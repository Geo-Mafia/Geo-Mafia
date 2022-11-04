import * as definition from '.';
import * as observable from '../../data/observable';
import * as imageSource from '../../image-source';
export interface DownloadRequest {
    url: string;
    key: string;
    completed?: (image: any, key: string) => void;
    error?: (key: string) => void;
}
export declare class Cache extends observable.Observable implements definition.Cache {
    static downloadedEvent: string;
    static downloadErrorEvent: string;
    placeholder: imageSource.ImageSource;
    maxRequests: number;
    private _enabled;
    private _pendingDownloads;
    private _queue;
    private _currentDownloads;
    enableDownload(): void;
    disableDownload(): void;
    push(request: DownloadRequest): void;
    enqueue(request: DownloadRequest): void;
    private _addRequest;
    private _mergeRequests;
    get(key: string): any;
    set(key: string, image: any): void;
    remove(key: string): void;
    clear(): void;
    _downloadCore(request: definition.DownloadRequest): void;
    _onDownloadCompleted(key: string, image: any): void;
    _onDownloadError(key: string, err: Error): void;
    private _shouldDownload;
    private _download;
    private _updateQueue;
}
export interface Cache {
    on(eventNames: string, callback: (args: observable.EventData) => void, thisArg?: any): any;
    on(event: 'downloaded', callback: (args: definition.DownloadedData) => void, thisArg?: any): any;
    on(event: 'downloadError', callback: (args: definition.DownloadError) => void, thisArg?: any): any;
}
