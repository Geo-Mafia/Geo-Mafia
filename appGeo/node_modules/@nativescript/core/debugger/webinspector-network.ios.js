var NetworkDomainDebugger_1;
const inspectorCommands = require('./InspectorBackendCommands');
import * as debuggerDomains from '.';
const frameId = 'NativeScriptMainFrameIdentifier';
const loaderId = 'Loader Identifier';
const resources_datas = [];
const documentTypeByMimeType = {
    'text/xml': 'Document',
    'text/plain': 'Document',
    'text/html': 'Document',
    'application/xml': 'Document',
    'application/xhtml+xml': 'Document',
    'text/css': 'Stylesheet',
    'text/javascript': 'Script',
    'text/ecmascript': 'Script',
    'application/javascript': 'Script',
    'application/ecmascript': 'Script',
    'application/x-javascript': 'Script',
    'application/json': 'Script',
    'application/x-json': 'Script',
    'text/x-javascript': 'Script',
    'text/x-json': 'Script',
    'text/typescript': 'Script',
};
export class Request {
    constructor(_networkDomainDebugger, _requestID) {
        this._networkDomainDebugger = _networkDomainDebugger;
        this._requestID = _requestID;
    }
    get mimeType() {
        return this._mimeType;
    }
    set mimeType(value) {
        if (this._mimeType !== value) {
            if (!value) {
                this._mimeType = 'text/plain';
                this._resourceType = 'Other';
                return;
            }
            this._mimeType = value;
            let resourceType = 'Other';
            if (this._mimeType in documentTypeByMimeType) {
                resourceType = documentTypeByMimeType[this._mimeType];
            }
            if (this._mimeType.indexOf('image/') !== -1) {
                resourceType = 'Image';
            }
            if (this._mimeType.indexOf('font/') !== -1) {
                resourceType = 'Font';
            }
            this._resourceType = resourceType;
        }
    }
    get requestID() {
        return this._requestID;
    }
    get hasTextContent() {
        return ['Document', 'Stylesheet', 'Script', 'XHR'].indexOf(this._resourceType) !== -1;
    }
    get data() {
        return this._data;
    }
    set data(value) {
        if (this._data !== value) {
            this._data = value;
        }
    }
    get resourceType() {
        return this._resourceType;
    }
    set resourceType(value) {
        if (this._resourceType !== value) {
            this._resourceType = value;
        }
    }
    responseReceived(response) {
        if (this._networkDomainDebugger.enabled) {
            this._networkDomainDebugger.events.responseReceived(this.requestID, frameId, loaderId, __inspectorTimestamp(), this.resourceType, response);
        }
    }
    loadingFinished() {
        if (this._networkDomainDebugger.enabled) {
            this._networkDomainDebugger.events.loadingFinished(this.requestID, __inspectorTimestamp());
        }
    }
    requestWillBeSent(request) {
        if (this._networkDomainDebugger.enabled) {
            this._networkDomainDebugger.events.requestWillBeSent(this.requestID, frameId, loaderId, request.url, request, __inspectorTimestamp(), { type: 'Script' });
        }
    }
}
let NetworkDomainDebugger = NetworkDomainDebugger_1 = class NetworkDomainDebugger {
    constructor() {
        this.events = new inspectorCommands.NetworkDomain.NetworkFrontend();
        // By default start enabled because we can miss the "enable" event when
        // running with `--debug-brk` -- the frontend will send it before we've been created
        this.enable();
    }
    get enabled() {
        return this._enabled;
    }
    /**
     * Enables network tracking, network events will now be delivered to the client.
     */
    enable() {
        if (debuggerDomains.getNetwork()) {
            throw new Error('One NetworkDomainDebugger may be enabled at a time.');
        }
        else {
            debuggerDomains.setNetwork(this);
        }
        this._enabled = true;
    }
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable() {
        if (debuggerDomains.getNetwork() === this) {
            debuggerDomains.setNetwork(null);
        }
        this._enabled = false;
    }
    /**
     * Specifies whether to always send extra HTTP headers with the requests from this page.
     */
    setExtraHTTPHeaders(params) {
        //
    }
    /**
     * Returns content served for the given request.
     */
    getResponseBody(params) {
        const resource_data = resources_datas[params.requestId];
        const body = resource_data.hasTextContent ? NSString.alloc().initWithDataEncoding(resource_data.data, 4).toString() : resource_data.data.base64EncodedStringWithOptions(0);
        if (resource_data) {
            return {
                body: body,
                base64Encoded: !resource_data.hasTextContent,
            };
        }
    }
    /**
     * Tells whether clearing browser cache is supported.
     */
    canClearBrowserCache() {
        return {
            result: false,
        };
    }
    /**
     * Clears browser cache.
     */
    clearBrowserCache() {
        //
    }
    /**
     * Tells whether clearing browser cookies is supported.
     */
    canClearBrowserCookies() {
        return {
            result: false,
        };
    }
    /**
     * Clears browser cookies.
     */
    clearBrowserCookies() {
        //
    }
    /**
     * Toggles ignoring cache for each request. If <code>true</code>, cache will not be used.
     */
    setCacheDisabled(params) {
        //
    }
    /**
     * Loads a resource in the context of a frame on the inspected page without cross origin checks.
     */
    loadResource(params) {
        const appPath = NSBundle.mainBundle.bundlePath;
        const pathUrl = params.url.replace('file://', appPath);
        const fileManager = NSFileManager.defaultManager;
        const data = fileManager.fileExistsAtPath(pathUrl) ? fileManager.contentsAtPath(pathUrl) : undefined;
        const content = data ? NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding) : '';
        return {
            content: content.toString(),
            mimeType: 'application/octet-stream',
            status: 200,
        };
    }
    create() {
        const id = (++NetworkDomainDebugger_1.idSequence).toString();
        const resourceData = new Request(this, id);
        resources_datas[id] = resourceData;
        return resourceData;
    }
};
NetworkDomainDebugger.idSequence = 0;
NetworkDomainDebugger = NetworkDomainDebugger_1 = __decorate([
    inspectorCommands.DomainDispatcher('Network'),
    __metadata("design:paramtypes", [])
], NetworkDomainDebugger);
export { NetworkDomainDebugger };
//# sourceMappingURL=webinspector-network.ios.js.map