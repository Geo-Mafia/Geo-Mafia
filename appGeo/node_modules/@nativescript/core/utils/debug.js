import { knownFolders } from '../file-system';
export const debug = true;
let applicationRootPath;
function ensureAppRootPath() {
    if (!applicationRootPath) {
        applicationRootPath = knownFolders.currentApp().path;
        applicationRootPath = applicationRootPath.substr(0, applicationRootPath.length - 'app/'.length);
    }
}
export class Source {
    constructor(uri, line, column) {
        ensureAppRootPath();
        if (uri.length > applicationRootPath.length && uri.substr(0, applicationRootPath.length) === applicationRootPath) {
            this._uri = 'file://' + uri.substr(applicationRootPath.length);
        }
        else {
            this._uri = uri;
        }
        this._line = line;
        this._column = column;
    }
    get uri() {
        return this._uri;
    }
    get line() {
        return this._line;
    }
    get column() {
        return this._column;
    }
    toString() {
        return this._uri + ':' + this._line + ':' + this._column;
    }
    static get(object) {
        return object[Source._source];
    }
    static set(object, src) {
        object[Source._source] = src;
    }
}
Source._source = Symbol('source');
export class ScopeError extends Error {
    constructor(inner, message) {
        let formattedMessage;
        if (message && inner.message) {
            formattedMessage = message + '\n > ' + inner.message.replace('\n', '\n  ');
        }
        else {
            formattedMessage = message || inner.message || undefined;
        }
        super(formattedMessage);
        this.stack = global.isAndroid ? 'Error: ' + this.message + '\n' + inner.stack.substr(inner.stack.indexOf('\n') + 1) : inner.stack;
        this.message = formattedMessage;
    }
}
export class SourceError extends ScopeError {
    constructor(child, source, message) {
        super(child, message ? message + ' @' + source + '' : source + '');
    }
}
//# sourceMappingURL=debug.js.map