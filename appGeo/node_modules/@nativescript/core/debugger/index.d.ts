export declare namespace domains {
    namespace network {
        interface NetworkDomainDebugger {
            create(): domains.network.NetworkRequest;
        }
        interface Headers {
        }
        interface Request {
            url: string;
            method: string;
            headers: domains.network.Headers;
            postData?: string;
        }
        interface Response {
            url: string;
            status: number;
            statusText: string;
            headers: Headers;
            headersText?: string;
            mimeType: string;
            requestHeaders?: domains.network.Headers;
            requestHeadersText?: string;
            fromDiskCache?: boolean;
        }
        interface NetworkRequest {
            mimeType: string;
            data: any;
            responseReceived(response: domains.network.Response): any;
            loadingFinished(): any;
            requestWillBeSent(request: domains.network.Request): any;
        }
    }
}
export declare function getNetwork(): domains.network.NetworkDomainDebugger;
export declare function setNetwork(newNetwork: domains.network.NetworkDomainDebugger): void;
export declare function getDOM(): any;
export declare function setDOM(newDOM: any): void;
export declare function getCSS(): any;
export declare function setCSS(newCSS: any): void;
export declare namespace NetworkAgent {
    interface Request {
        url: string;
        method: string;
        headers: any;
        initialPriority: string;
        referrerPolicy: string;
        postData?: string;
    }
    interface RequestData {
        requestId: string;
        url: string;
        request: Request;
        timestamp: number;
        type: string;
        wallTime: number;
    }
    interface Response {
        url: string;
        status: number;
        statusText: string;
        headers: any;
        headersText?: string;
        mimeType: string;
        connectionReused: boolean;
        connectionId: number;
        encodedDataLength: number;
        securityState: string;
        fromDiskCache?: boolean;
    }
    interface ResponseData {
        requestId: string;
        type: string;
        response: Response;
        timestamp: number;
    }
    interface SuccessfulRequestData {
        requestId: string;
        data: string;
        hasTextContent: boolean;
    }
    interface LoadingFinishedData {
        requestId: string;
        timestamp: number;
    }
    function responseReceived(requestId: number, result: org.nativescript.widgets.Async.Http.RequestResult, headers: any): void;
    function requestWillBeSent(requestId: number, options: any): void;
}
