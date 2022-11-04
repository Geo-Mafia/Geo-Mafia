import * as inspectorCommandTypes from './InspectorBackendCommands.ios';
export declare class Request {
    private _networkDomainDebugger;
    private _requestID;
    private _resourceType;
    private _data;
    private _mimeType;
    constructor(_networkDomainDebugger: NetworkDomainDebugger, _requestID: string);
    get mimeType(): string;
    set mimeType(value: string);
    get requestID(): string;
    get hasTextContent(): boolean;
    get data(): any;
    set data(value: any);
    get resourceType(): string;
    set resourceType(value: string);
    responseReceived(response: inspectorCommandTypes.NetworkDomain.Response): void;
    loadingFinished(): void;
    requestWillBeSent(request: inspectorCommandTypes.NetworkDomain.Request): void;
}
export declare class NetworkDomainDebugger implements inspectorCommandTypes.NetworkDomain.NetworkDomainDispatcher {
    private _enabled;
    events: inspectorCommandTypes.NetworkDomain.NetworkFrontend;
    constructor();
    get enabled(): boolean;
    /**
     * Enables network tracking, network events will now be delivered to the client.
     */
    enable(): void;
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable(): void;
    /**
     * Specifies whether to always send extra HTTP headers with the requests from this page.
     */
    setExtraHTTPHeaders(params: inspectorCommandTypes.NetworkDomain.SetExtraHTTPHeadersMethodArguments): void;
    /**
     * Returns content served for the given request.
     */
    getResponseBody(params: inspectorCommandTypes.NetworkDomain.GetResponseBodyMethodArguments): {
        body: string;
        base64Encoded: boolean;
    };
    /**
     * Tells whether clearing browser cache is supported.
     */
    canClearBrowserCache(): {
        result: boolean;
    };
    /**
     * Clears browser cache.
     */
    clearBrowserCache(): void;
    /**
     * Tells whether clearing browser cookies is supported.
     */
    canClearBrowserCookies(): {
        result: boolean;
    };
    /**
     * Clears browser cookies.
     */
    clearBrowserCookies(): void;
    /**
     * Toggles ignoring cache for each request. If <code>true</code>, cache will not be used.
     */
    setCacheDisabled(params: inspectorCommandTypes.NetworkDomain.SetCacheDisabledMethodArguments): void;
    /**
     * Loads a resource in the context of a frame on the inspected page without cross origin checks.
     */
    loadResource(params: inspectorCommandTypes.NetworkDomain.LoadResourceMethodArguments): {
        content: string;
        mimeType: string;
        status: number;
    };
    static idSequence: number;
    create(): Request;
}
