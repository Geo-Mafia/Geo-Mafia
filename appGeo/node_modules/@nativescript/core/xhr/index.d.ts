export declare class XMLHttpRequest {
    UNSENT: number;
    OPENED: number;
    HEADERS_RECEIVED: number;
    LOADING: number;
    DONE: number;
    onabort: (...args: any[]) => void;
    onerror: (...args: any[]) => void;
    onload: (...args: any[]) => void;
    onloadend: (...args: any[]) => void;
    onloadstart: (...args: any[]) => void;
    onprogress: (...args: any[]) => void;
    private _options;
    private _readyState;
    private _status;
    private _response;
    private _responseTextReader;
    private _headers;
    private _errorFlag;
    private _sendFlag;
    private _responseType;
    private _overrideMimeType;
    private _listeners;
    onreadystatechange: Function;
    get upload(): this;
    get readyState(): number;
    get responseType(): string;
    set responseType(value: string);
    get responseText(): string;
    get response(): any;
    get status(): number;
    get statusText(): string;
    constructor();
    private _loadResponse;
    private emitEvent;
    private _setReadyState;
    private _setRequestError;
    addEventListener(eventName: string, handler: Function): void;
    removeEventListener(eventName: string, toDetach: Function): void;
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
    abort(): void;
    send(data?: any): void;
    setRequestHeader(header: string, value: string): void;
    getAllResponseHeaders(): string;
    getResponseHeader(header: string): string;
    overrideMimeType(mime: string): void;
}
export declare class FormData {
    private _data;
    constructor();
    append(name: string, value: any): void;
    toString(): string;
}
export declare class Blob {
    static InternalAccessor: {
        new (): {};
        getBuffer(blob: Blob): Uint8Array;
    };
    private _buffer;
    private _size;
    private _type;
    get size(): number;
    get type(): string;
    constructor(chunks?: Array<BufferSource | DataView | Blob | string>, opts?: {
        type?: string;
    });
    arrayBuffer(): Promise<ArrayBuffer>;
    text(): Promise<string>;
    slice(start?: number, end?: number, type?: string): Blob;
    stream(): void;
    toString(): string;
    [Symbol.toStringTag]: string;
}
export declare class File extends Blob {
    private _name;
    private _lastModified;
    get name(): string;
    get lastModified(): number;
    constructor(chunks: Array<BufferSource | DataView | Blob | string>, name: string, opts?: {
        type?: string;
        lastModified?: number;
    });
    toString(): string;
    [Symbol.toStringTag]: string;
}
export declare class FileReader {
    EMPTY: number;
    LOADING: number;
    DONE: number;
    onabort: (...args: any[]) => void;
    onerror: (...args: any[]) => void;
    onload: (...args: any[]) => void;
    onloadend: (...args: any[]) => void;
    onloadstart: (...args: any[]) => void;
    onprogress: (...args: any[]) => void;
    private _readyState;
    private _result;
    private _listeners;
    get readyState(): number;
    get result(): string | ArrayBuffer | null;
    constructor();
    private _array2base64;
    private _read;
    private emitEvent;
    addEventListener(eventName: string, handler: Function): void;
    removeEventListener(eventName: string, toDetach: Function): void;
    readAsDataURL(blob: Blob): void;
    readAsText(blob: Blob): void;
    readAsArrayBuffer(blob: Blob): void;
    abort(): void;
    toString(): string;
    [Symbol.toStringTag]: string;
}
