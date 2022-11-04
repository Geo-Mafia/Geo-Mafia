let network;
export function getNetwork() {
    return network;
}
export function setNetwork(newNetwork) {
    network = newNetwork;
}
let dom;
export function getDOM() {
    return dom;
}
export function setDOM(newDOM) {
    dom = newDOM;
}
let css;
export function getCSS() {
    return css;
}
export function setCSS(newCSS) {
    css = newCSS;
}
export var NetworkAgent;
(function (NetworkAgent) {
    function responseReceived(requestId, result, headers) {
        const requestIdStr = requestId.toString();
        // Content-Type and content-type are both common in headers spelling
        const mimeType = headers['Content-Type'] || headers['content-type'] || 'application/octet-stream';
        const contentLengthHeader = headers['Content-Length'] || headers['content-length'];
        let contentLength = parseInt(contentLengthHeader, 10);
        if (isNaN(contentLength)) {
            contentLength = 0;
        }
        const response = {
            url: result.url || '',
            status: result.statusCode,
            statusText: result.statusText || '',
            headers: headers,
            mimeType: mimeType,
            fromDiskCache: false,
            connectionReused: true,
            connectionId: 0,
            encodedDataLength: contentLength,
            securityState: 'info',
        };
        const responseData = {
            requestId: requestIdStr,
            type: mimeTypeToType(response.mimeType),
            response: response,
            timestamp: getTimeStamp(),
        };
        global.__inspector.responseReceived(responseData);
        global.__inspector.loadingFinished({
            requestId: requestIdStr,
            timestamp: getTimeStamp(),
            encodedDataLength: contentLength,
        });
        const hasTextContent = responseData.type === 'Document' || responseData.type === 'Script';
        let data;
        if (!hasTextContent) {
            if (responseData.type === 'Image') {
                const bitmap = result.responseAsImage;
                if (bitmap) {
                    const outputStream = new java.io.ByteArrayOutputStream();
                    bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, outputStream);
                    const base64Image = android.util.Base64.encodeToString(outputStream.toByteArray(), android.util.Base64.DEFAULT);
                    data = base64Image;
                }
            }
        }
        else {
            data = result.responseAsString;
        }
        const successfulRequestData = {
            requestId: requestIdStr,
            data: data,
            hasTextContent: hasTextContent,
        };
        global.__inspector.dataForRequestId(successfulRequestData);
    }
    NetworkAgent.responseReceived = responseReceived;
    function requestWillBeSent(requestId, options) {
        const request = {
            url: options.url,
            method: options.method,
            headers: options.headers || {},
            postData: options.content ? options.content.toString() : '',
            initialPriority: 'Medium',
            referrerPolicy: 'no-referrer-when-downgrade',
        };
        const requestData = {
            requestId: requestId.toString(),
            url: request.url,
            request: request,
            timestamp: getTimeStamp(),
            type: 'Document',
            wallTime: 0,
        };
        global.__inspector.requestWillBeSent(requestData);
    }
    NetworkAgent.requestWillBeSent = requestWillBeSent;
    function getTimeStamp() {
        const d = new Date();
        return Math.round(d.getTime() / 1000);
    }
    function mimeTypeToType(mimeType) {
        let type = 'Document';
        if (mimeType) {
            if (mimeType.indexOf('image') === 0) {
                type = 'Image';
            }
            else if (mimeType.indexOf('javascript') !== -1 || mimeType.indexOf('json') !== -1) {
                type = 'Script';
            }
        }
        return type;
    }
})(NetworkAgent || (NetworkAgent = {}));
//# sourceMappingURL=index.js.map