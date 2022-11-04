var _a, _b, _c;
import * as http from '../http';
import * as types from '../utils/types';
import { Trace } from '../trace';
var XMLHttpRequestResponseType;
(function (XMLHttpRequestResponseType) {
    XMLHttpRequestResponseType.empty = '';
    XMLHttpRequestResponseType.text = 'text';
    XMLHttpRequestResponseType.json = 'json';
    XMLHttpRequestResponseType.blob = 'blob';
    XMLHttpRequestResponseType.arraybuffer = 'arraybuffer';
})(XMLHttpRequestResponseType || (XMLHttpRequestResponseType = {}));
export class XMLHttpRequest {
    constructor() {
        this.UNSENT = 0;
        this.OPENED = 1;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.DONE = 4;
        this._responseType = '';
        this._listeners = new Map();
        this._readyState = this.UNSENT;
    }
    get upload() {
        return this;
    }
    get readyState() {
        return this._readyState;
    }
    get responseType() {
        return this._responseType;
    }
    set responseType(value) {
        if (value === XMLHttpRequestResponseType.empty || value in XMLHttpRequestResponseType) {
            this._responseType = value;
        }
        else {
            throw new Error(`Response type of '${value}' not supported.`);
        }
    }
    get responseText() {
        if (this._responseType !== XMLHttpRequestResponseType.empty && this._responseType !== XMLHttpRequestResponseType.text) {
            throw new Error("Failed to read the 'responseText' property from 'XMLHttpRequest': " + "The value is only accessible if the object's 'responseType' is '' or 'text' " + `(was '${this._responseType}').`);
        }
        if (types.isFunction(this._responseTextReader)) {
            return this._responseTextReader();
        }
        return '';
    }
    get response() {
        if (this._responseType === XMLHttpRequestResponseType.empty || this._responseType === XMLHttpRequestResponseType.text) {
            if (this._readyState !== this.LOADING && this._readyState !== this.DONE) {
                return '';
            }
            else {
                return this._response;
            }
        }
        else {
            if (this._readyState !== this.DONE) {
                return null;
            }
            else {
                return this._response;
            }
        }
    }
    get status() {
        return this._status;
    }
    get statusText() {
        if (this._readyState === this.UNSENT || this._readyState === this.OPENED || this._errorFlag) {
            return '';
        }
        return statuses[this._status];
    }
    _loadResponse(r) {
        this._status = r.statusCode;
        this._headers = r.headers;
        this._setReadyState(this.HEADERS_RECEIVED);
        this._setReadyState(this.LOADING);
        this._responseTextReader = () => r.content.toString();
        const contentType = this.getResponseHeader('Content-Type');
        const mimeType = (contentType && contentType.toLowerCase()) || 'text/xml';
        const finalMimeType = this._overrideMimeType || mimeType;
        if (this._responseType === XMLHttpRequestResponseType.json) {
            this._response = r.content.toJSON();
        }
        else if (this._responseType === XMLHttpRequestResponseType.text || this._responseType === XMLHttpRequestResponseType.empty) {
            this._response = this.responseText;
        }
        else if (this._responseType === XMLHttpRequestResponseType.arraybuffer) {
            this._response = r.content.toArrayBuffer();
        }
        else if (this._responseType === XMLHttpRequestResponseType.blob) {
            this._response = new Blob([r.content.toArrayBuffer()], {
                type: finalMimeType,
            });
        }
        this.emitEvent('progress');
        this._sendFlag = false;
        this._setReadyState(this.DONE);
    }
    emitEvent(eventName, ...args) {
        if (types.isFunction(this['on' + eventName])) {
            this['on' + eventName](...args);
        }
        const handlers = this._listeners.get(eventName) || [];
        handlers.forEach((handler) => {
            handler(...args);
        });
    }
    _setReadyState(value) {
        if (this._readyState !== value) {
            this._readyState = value;
            this.emitEvent('readystatechange');
        }
        if (this._readyState === this.DONE) {
            this.emitEvent('load');
            this.emitEvent('loadend');
        }
    }
    _setRequestError(eventName, error) {
        this._readyState = this.DONE;
        this._response = error;
        this.emitEvent('readystatechange');
        this.emitEvent(eventName, error);
        this.emitEvent('loadend');
    }
    addEventListener(eventName, handler) {
        if (['abort', 'error', 'load', 'loadend', 'loadstart', 'progress', 'readystatechange'].indexOf(eventName) === -1) {
            if (Trace.isEnabled()) {
                Trace.write('XHR Event not supported: ' + eventName, Trace.categories.Debug, Trace.messageType.warn);
            }
        }
        const handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    }
    removeEventListener(eventName, toDetach) {
        let handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter((handler) => handler !== toDetach);
        this._listeners.set(eventName, handlers);
    }
    open(method, url, async, user, password) {
        if (types.isString(method) && types.isString(url)) {
            this._options = { url: url, method: method };
            this._options.headers = {};
            if (types.isString(user)) {
                this._options.headers['user'] = user;
            }
            if (types.isString(password)) {
                this._options.headers['password'] = password;
            }
            this._setReadyState(this.OPENED);
        }
    }
    abort() {
        this._response = null;
        this._responseTextReader = null;
        this._headers = null;
        this._status = null;
        if ((this._readyState === this.OPENED && this._sendFlag) || this._readyState === this.HEADERS_RECEIVED || this._readyState === this.LOADING) {
            this._errorFlag = true;
            this._sendFlag = false;
            this._setRequestError('abort');
        }
        if (this._readyState === this.DONE) {
            this._readyState = this.UNSENT;
        }
    }
    send(data) {
        this._errorFlag = false;
        this._response = null;
        this._responseTextReader = null;
        this._headers = null;
        this._status = null;
        if (this._readyState !== this.OPENED || this._sendFlag) {
            throw new Error("Failed to execute 'send' on 'XMLHttpRequest': " + "The object's state must be OPENED.");
        }
        if (types.isString(data) && this._options.method !== 'GET') {
            //The Android Java HTTP lib throws an exception if we provide a
            //a request body for GET requests, so we avoid doing that.
            //Browser implementations silently ignore it as well.
            this._options.content = data;
        }
        else if (data instanceof FormData) {
            this._options.content = data.toString();
        }
        else if (data instanceof Blob) {
            this.setRequestHeader('Content-Type', data.type);
            this._options.content = Blob.InternalAccessor.getBuffer(data);
        }
        else if (data instanceof ArrayBuffer) {
            this._options.content = data;
        }
        this._sendFlag = true;
        this.emitEvent('loadstart');
        http
            .request(this._options)
            .then((r) => {
            if (!this._errorFlag && this._sendFlag) {
                this._loadResponse(r);
            }
        })
            .catch((e) => {
            this._errorFlag = true;
            this._sendFlag = false;
            this._setRequestError('error', e);
        });
    }
    setRequestHeader(header, value) {
        if (this._readyState !== this.OPENED || this._sendFlag) {
            throw new Error("Failed to execute 'setRequestHeader' on 'XMLHttpRequest': " + "The object's state must be OPENED.");
        }
        if (types.isString(header) && types.isString(value)) {
            this._options.headers[header] = value;
        }
    }
    getAllResponseHeaders() {
        if (this._readyState < 2 || this._errorFlag) {
            return '';
        }
        let result = '';
        for (const i in this._headers) {
            result += i + ': ' + this._headers[i] + '\r\n';
        }
        return result.substr(0, result.length - 2);
    }
    getResponseHeader(header) {
        if (types.isString(header) && this._readyState > 1 && this._headers && !this._errorFlag) {
            header = header.toLowerCase();
            for (const i in this._headers) {
                if (i.toLowerCase() === header) {
                    return this._headers[i];
                }
            }
        }
        return null;
    }
    overrideMimeType(mime) {
        if (this._readyState === this.LOADING || this._readyState === this.DONE) {
            throw new Error("Failed to execute 'overrideMimeType' on 'XMLHttpRequest': " + 'MimeType cannot be overridden when the state is LOADING or DONE.');
        }
        this._overrideMimeType = mime;
    }
}
const statuses = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non - Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request - URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
};
export class FormData {
    constructor() {
        this._data = new Map();
    }
    append(name, value) {
        this._data.set(name, value);
    }
    toString() {
        const arr = new Array();
        this._data.forEach(function (value, name, map) {
            arr.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        });
        return arr.join('&');
    }
}
export class Blob {
    constructor(chunks = [], opts = {}) {
        this[_a] = 'Blob';
        const dataChunks = [];
        for (const chunk of chunks) {
            if (chunk instanceof Blob) {
                dataChunks.push(chunk._buffer);
            }
            else if (typeof chunk === 'string') {
                const textEncoder = new TextEncoder();
                dataChunks.push(textEncoder.encode(chunk));
            }
            else if (chunk instanceof DataView) {
                dataChunks.push(new Uint8Array(chunk.buffer.slice(0)));
            }
            else if (chunk instanceof ArrayBuffer || ArrayBuffer.isView(chunk)) {
                dataChunks.push(new Uint8Array(ArrayBuffer.isView(chunk) ? chunk.buffer.slice(0) : chunk.slice(0)));
            }
            else {
                const textEncoder = new TextEncoder();
                dataChunks.push(textEncoder.encode(String(chunk)));
            }
        }
        const size = dataChunks.reduce((size, chunk) => size + chunk.byteLength, 0);
        const buffer = new Uint8Array(size);
        let offset = 0;
        for (let i = 0; i < dataChunks.length; i++) {
            const chunk = dataChunks[i];
            buffer.set(chunk, offset);
            offset += chunk.byteLength;
        }
        this._buffer = buffer;
        this._size = this._buffer.byteLength;
        this._type = opts.type || '';
        if (/[^\u0020-\u007E]/.test(this._type)) {
            this._type = '';
        }
        else {
            this._type = this._type.toLowerCase();
        }
    }
    get size() {
        return this._size;
    }
    get type() {
        return this._type;
    }
    arrayBuffer() {
        return Promise.resolve(this._buffer);
    }
    text() {
        const textDecoder = new TextDecoder();
        return Promise.resolve(textDecoder.decode(this._buffer));
    }
    slice(start, end, type) {
        const slice = this._buffer.slice(start || 0, end || this._buffer.length);
        return new Blob([slice], { type: type });
    }
    stream() {
        throw new Error('stream is currently not supported');
    }
    toString() {
        return '[object Blob]';
    }
}
_a = Symbol.toStringTag;
// Note: only for use by XHR
Blob.InternalAccessor = class {
    static getBuffer(blob) {
        return blob._buffer;
    }
};
export class File extends Blob {
    constructor(chunks, name, opts = {}) {
        super(chunks, opts);
        this[_b] = 'File';
        this._name = name.replace(/\//g, ':');
        this._lastModified = opts.lastModified ? new Date(opts.lastModified).valueOf() : Date.now();
    }
    get name() {
        return this._name;
    }
    get lastModified() {
        return this._lastModified;
    }
    toString() {
        return '[object File]';
    }
}
_b = Symbol.toStringTag;
export class FileReader {
    constructor() {
        this.EMPTY = 0;
        this.LOADING = 1;
        this.DONE = 2;
        this._listeners = new Map();
        this[_c] = 'FileReader';
        //
    }
    get readyState() {
        return this._readyState;
    }
    get result() {
        return this._result;
    }
    _array2base64(input) {
        const byteToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const output = [];
        for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
            let outByte3 = ((byte2 & 0x0f) << 2) | (byte3 >> 6);
            let outByte4 = byte3 & 0x3f;
            if (!haveByte3) {
                outByte4 = 64;
                if (!haveByte2) {
                    outByte3 = 64;
                }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
        }
        return output.join('');
    }
    _read(blob, kind) {
        if (!(blob instanceof Blob)) {
            throw new TypeError(`Failed to execute '${kind}' on 'FileReader': parameter 1 is not of type 'Blob'.`);
        }
        this._result = '';
        setTimeout(() => {
            this._readyState = this.LOADING;
            this.emitEvent('load');
            this.emitEvent('loadend');
        });
    }
    emitEvent(eventName, ...args) {
        if (types.isFunction(this['on' + eventName])) {
            this['on' + eventName](...args);
        }
        const handlers = this._listeners.get(eventName) || [];
        handlers.forEach((handler) => {
            handler(...args);
        });
    }
    addEventListener(eventName, handler) {
        if (['abort', 'error', 'load', 'loadend', 'loadstart', 'progress'].indexOf(eventName) === -1) {
            throw new Error('Event not supported: ' + eventName);
        }
        const handlers = this._listeners.get(eventName) || [];
        handlers.push(handler);
        this._listeners.set(eventName, handlers);
    }
    removeEventListener(eventName, toDetach) {
        let handlers = this._listeners.get(eventName) || [];
        handlers = handlers.filter((handler) => handler !== toDetach);
        this._listeners.set(eventName, handlers);
    }
    readAsDataURL(blob) {
        this._read(blob, 'readAsDataURL');
        this._result = `data:${blob.type};base64,${this._array2base64(Blob.InternalAccessor.getBuffer(blob))}`;
    }
    readAsText(blob) {
        this._read(blob, 'readAsText');
        const textDecoder = new TextDecoder();
        this._result = textDecoder.decode(Blob.InternalAccessor.getBuffer(blob));
    }
    readAsArrayBuffer(blob) {
        this._read(blob, 'readAsArrayBuffer');
        this._result = Blob.InternalAccessor.getBuffer(blob).buffer.slice(0);
    }
    abort() {
        //
    }
    toString() {
        return '[object FileReader]';
    }
}
_c = Symbol.toStringTag;
//# sourceMappingURL=index.js.map