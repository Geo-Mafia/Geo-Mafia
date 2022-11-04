export function DomainDispatcher(domain) {
    return (klass) => __registerDomainDispatcher(domain, klass);
}
// Heap
// Heap domain exposes JavaScript heap attributes and capabilities.
export var HeapDomain;
(function (HeapDomain) {
    class HeapFrontend {
        // Information about the garbage collection.
        garbageCollected(collection) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Heap.garbageCollected',
                params: { collection: collection },
            }));
        }
        // Tracking started.
        trackingStart(timestamp, snapshotData) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Heap.trackingStart',
                params: {
                    timestamp: timestamp,
                    snapshotData: snapshotData,
                },
            }));
        }
        // Tracking stopped.
        trackingComplete(timestamp, snapshotData) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Heap.trackingComplete',
                params: {
                    timestamp: timestamp,
                    snapshotData: snapshotData,
                },
            }));
        }
    }
    HeapDomain.HeapFrontend = HeapFrontend;
})(HeapDomain || (HeapDomain = {}));
// Debugger
// Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc.
export var DebuggerDomain;
(function (DebuggerDomain) {
    class DebuggerFrontend {
        // Called when global has been cleared and debugger client should reset its state. Happens upon navigation or reload.
        globalObjectCleared() {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.globalObjectCleared',
                params: {},
            }));
        }
        // Fired when virtual machine parses script. This event is also fired for all known and uncollected scripts upon enabling debugger.
        scriptParsed(scriptId, url, startLine, startColumn, endLine, endColumn, isContentScript, sourceURL, sourceMapURL) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.scriptParsed',
                params: {
                    scriptId: scriptId,
                    url: url,
                    startLine: startLine,
                    startColumn: startColumn,
                    endLine: endLine,
                    endColumn: endColumn,
                    isContentScript: isContentScript,
                    sourceURL: sourceURL,
                    sourceMapURL: sourceMapURL,
                },
            }));
        }
        // Fired when virtual machine fails to parse the script.
        scriptFailedToParse(url, scriptSource, startLine, errorLine, errorMessage) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.scriptFailedToParse',
                params: {
                    url: url,
                    scriptSource: scriptSource,
                    startLine: startLine,
                    errorLine: errorLine,
                    errorMessage: errorMessage,
                },
            }));
        }
        // Fired when breakpoint is resolved to an actual script and location.
        breakpointResolved(breakpointId, location) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.breakpointResolved',
                params: { breakpointId: breakpointId, location: location },
            }));
        }
        // Fired when the virtual machine stopped on breakpoint or exception or any other stop criteria.
        paused(callFrames, reason /* XHR,DOM,EventListener,exception,assert,CSPViolation,DebuggerStatement,Breakpoint,PauseOnNextStatement,other */, data) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.paused',
                params: {
                    callFrames: callFrames,
                    reason: reason,
                    data: data,
                },
            }));
        }
        // Fired when the virtual machine resumed execution.
        resumed() {
            __inspectorSendEvent(JSON.stringify({ method: 'Debugger.resumed', params: {} }));
        }
        // Fires when a new probe sample is collected.
        didSampleProbe(sample) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.didSampleProbe',
                params: { sample: sample },
            }));
        }
        // Fired when a "sound" breakpoint action is triggered on a breakpoint.
        playBreakpointActionSound(breakpointActionId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Debugger.playBreakpointActionSound',
                params: { breakpointActionId: breakpointActionId },
            }));
        }
    }
    DebuggerDomain.DebuggerFrontend = DebuggerFrontend;
})(DebuggerDomain || (DebuggerDomain = {}));
// Runtime
// Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group.
export var RuntimeDomain;
(function (RuntimeDomain) {
    class RuntimeFrontend {
        // Issued when new execution context is created.
        executionContextCreated(context) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Runtime.executionContextCreated',
                params: { context: context },
            }));
        }
    }
    RuntimeDomain.RuntimeFrontend = RuntimeFrontend;
})(RuntimeDomain || (RuntimeDomain = {}));
// Console
// Console domain defines methods and events for interaction with the JavaScript console. Console collects messages created by means of the <a href='http://getfirebug.com/wiki/index.php/Console_API'>JavaScript Console API</a>. One needs to enable this domain using <code>enable</code> command in order to start receiving the console messages. Browser collects messages issued while console domain is not enabled as well and reports them using <code>messageAdded</code> notification upon enabling.
export var ConsoleDomain;
(function (ConsoleDomain) {
    class ConsoleFrontend {
        // Issued when new console message is added.
        messageAdded(message) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Console.messageAdded',
                params: { message: message },
            }));
        }
        // Issued when subsequent message(s) are equal to the previous one(s).
        messageRepeatCountUpdated(count) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Console.messageRepeatCountUpdated',
                params: { count: count },
            }));
        }
        // Issued when console is cleared. This happens either upon <code>clearMessages</code> command or after page navigation.
        messagesCleared() {
            __inspectorSendEvent(JSON.stringify({
                method: 'Console.messagesCleared',
                params: {},
            }));
        }
        // Issued from console.takeHeapSnapshot.
        heapSnapshot(timestamp, snapshotData, title) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Console.heapSnapshot',
                params: {
                    timestamp: timestamp,
                    snapshotData: snapshotData,
                    title: title,
                },
            }));
        }
    }
    ConsoleDomain.ConsoleFrontend = ConsoleFrontend;
})(ConsoleDomain || (ConsoleDomain = {}));
// Page
// Actions and events related to the inspected page belong to the page domain.
export var PageDomain;
(function (PageDomain) {
    class PageFrontend {
        domContentEventFired(timestamp) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.domContentEventFired',
                params: { timestamp: timestamp },
            }));
        }
        loadEventFired(timestamp) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.loadEventFired',
                params: { timestamp: timestamp },
            }));
        }
        // Fired once navigation of the frame has completed. Frame is now associated with the new loader.
        frameNavigated(frame) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameNavigated',
                params: { frame: frame },
            }));
        }
        // Fired when frame has been detached from its parent.
        frameDetached(frameId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameDetached',
                params: { frameId: frameId },
            }));
        }
        // Fired when frame has started loading.
        frameStartedLoading(frameId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameStartedLoading',
                params: { frameId: frameId },
            }));
        }
        // Fired when frame has stopped loading.
        frameStoppedLoading(frameId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameStoppedLoading',
                params: { frameId: frameId },
            }));
        }
        // Fired when frame schedules a potential navigation.
        frameScheduledNavigation(frameId, delay) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameScheduledNavigation',
                params: { frameId: frameId, delay: delay },
            }));
        }
        // Fired when frame no longer has a scheduled navigation.
        frameClearedScheduledNavigation(frameId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.frameClearedScheduledNavigation',
                params: { frameId: frameId },
            }));
        }
        // Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) is about to open.
        javascriptDialogOpening(message) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.javascriptDialogOpening',
                params: { message: message },
            }));
        }
        // Fired when a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload) has been closed.
        javascriptDialogClosed() {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.javascriptDialogClosed',
                params: {},
            }));
        }
        // Fired when the JavaScript is enabled/disabled on the page
        scriptsEnabled(isEnabled) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Page.scriptsEnabled',
                params: { isEnabled: isEnabled },
            }));
        }
    }
    PageDomain.PageFrontend = PageFrontend;
})(PageDomain || (PageDomain = {}));
// Network
// Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc.
export var NetworkDomain;
(function (NetworkDomain) {
    class NetworkFrontend {
        // Fired when page is about to send HTTP request.
        requestWillBeSent(requestId, frameId, loaderId, documentURL, request, timestamp, initiator, redirectResponse, type) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.requestWillBeSent',
                params: {
                    requestId: requestId,
                    frameId: frameId,
                    loaderId: loaderId,
                    documentURL: documentURL,
                    request: request,
                    timestamp: timestamp,
                    initiator: initiator,
                    redirectResponse: redirectResponse,
                    type: type,
                },
            }));
        }
        // Fired if request ended up loading from cache.
        requestServedFromCache(requestId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.requestServedFromCache',
                params: { requestId: requestId },
            }));
        }
        // Fired when HTTP response is available.
        responseReceived(requestId, frameId, loaderId, timestamp, type, response) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.responseReceived',
                params: {
                    requestId: requestId,
                    frameId: frameId,
                    loaderId: loaderId,
                    timestamp: timestamp,
                    type: type,
                    response: response,
                },
            }));
        }
        // Fired when data chunk was received over the network.
        dataReceived(requestId, timestamp, dataLength, encodedDataLength) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.dataReceived',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    dataLength: dataLength,
                    encodedDataLength: encodedDataLength,
                },
            }));
        }
        // Fired when HTTP request has finished loading.
        loadingFinished(requestId, timestamp, sourceMapURL) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.loadingFinished',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    sourceMapURL: sourceMapURL,
                },
            }));
        }
        // Fired when HTTP request has failed to load.
        loadingFailed(requestId, timestamp, errorText, canceled) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.loadingFailed',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    errorText: errorText,
                    canceled: canceled,
                },
            }));
        }
        // Fired when HTTP request has been served from memory cache.
        requestServedFromMemoryCache(requestId, frameId, loaderId, documentURL, timestamp, initiator, resource) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.requestServedFromMemoryCache',
                params: {
                    requestId: requestId,
                    frameId: frameId,
                    loaderId: loaderId,
                    documentURL: documentURL,
                    timestamp: timestamp,
                    initiator: initiator,
                    resource: resource,
                },
            }));
        }
        // Fired when WebSocket is about to initiate handshake.
        webSocketWillSendHandshakeRequest(requestId, timestamp, request) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketWillSendHandshakeRequest',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    request: request,
                },
            }));
        }
        // Fired when WebSocket handshake response becomes available.
        webSocketHandshakeResponseReceived(requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketHandshakeResponseReceived',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    response: response,
                },
            }));
        }
        // Fired upon WebSocket creation.
        webSocketCreated(requestId, url) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketCreated',
                params: { requestId: requestId, url: url },
            }));
        }
        // Fired when WebSocket is closed.
        webSocketClosed(requestId, timestamp) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketClosed',
                params: { requestId: requestId, timestamp: timestamp },
            }));
        }
        // Fired when WebSocket frame is received.
        webSocketFrameReceived(requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketFrameReceived',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    response: response,
                },
            }));
        }
        // Fired when WebSocket frame error occurs.
        webSocketFrameError(requestId, timestamp, errorMessage) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketFrameError',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    errorMessage: errorMessage,
                },
            }));
        }
        // Fired when WebSocket frame is sent.
        webSocketFrameSent(requestId, timestamp, response) {
            __inspectorSendEvent(JSON.stringify({
                method: 'Network.webSocketFrameSent',
                params: {
                    requestId: requestId,
                    timestamp: timestamp,
                    response: response,
                },
            }));
        }
    }
    NetworkDomain.NetworkFrontend = NetworkFrontend;
})(NetworkDomain || (NetworkDomain = {}));
// DOM
// This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.
export var DOMDomain;
(function (DOMDomain) {
    class DOMFrontend {
        // Fired when <code>Document</code> has been totally updated. Node ids are no longer valid.
        documentUpdated() {
            __inspectorSendEvent(JSON.stringify({ method: 'DOM.documentUpdated', params: {} }));
        }
        // Fired when backend wants to provide client with the missing DOM structure. This happens upon most of the calls requesting node ids.
        setChildNodes(parentId, nodes) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.setChildNodes',
                params: { parentId: parentId, nodes: nodes },
            }));
        }
        // Fired when <code>Element</code>'s attribute is modified.
        attributeModified(nodeId, name, value) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.attributeModified',
                params: { nodeId: nodeId, name: name, value: value },
            }));
        }
        // Fired when <code>Element</code>'s attribute is removed.
        attributeRemoved(nodeId, name) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.attributeRemoved',
                params: { nodeId: nodeId, name: name },
            }));
        }
        // Fired when <code>Element</code>'s inline style is modified via a CSS property modification.
        inlineStyleInvalidated(nodeIds) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.inlineStyleInvalidated',
                params: { nodeIds: nodeIds },
            }));
        }
        // Mirrors <code>DOMCharacterDataModified</code> event.
        characterDataModified(nodeId, characterData) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.characterDataModified',
                params: { nodeId: nodeId, characterData: characterData },
            }));
        }
        // Fired when <code>Container</code>'s child node count has changed.
        childNodeCountUpdated(nodeId, childNodeCount) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.childNodeCountUpdated',
                params: { nodeId: nodeId, childNodeCount: childNodeCount },
            }));
        }
        // Mirrors <code>DOMNodeInserted</code> event.
        childNodeInserted(parentNodeId, previousNodeId, node) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.childNodeInserted',
                params: {
                    parentNodeId: parentNodeId,
                    previousNodeId: previousNodeId,
                    node: node,
                },
            }));
        }
        // Mirrors <code>DOMNodeRemoved</code> event.
        childNodeRemoved(parentNodeId, nodeId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.childNodeRemoved',
                params: { parentNodeId: parentNodeId, nodeId: nodeId },
            }));
        }
        // Called when shadow root is pushed into the element.
        shadowRootPushed(hostId, root) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.shadowRootPushed',
                params: { hostId: hostId, root: root },
            }));
        }
        // Called when shadow root is popped from the element.
        shadowRootPopped(hostId, rootId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.shadowRootPopped',
                params: { hostId: hostId, rootId: rootId },
            }));
        }
        // Called when a pseudo element is added to an element.
        pseudoElementAdded(parentId, pseudoElement) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.pseudoElementAdded',
                params: {
                    parentId: parentId,
                    pseudoElement: pseudoElement,
                },
            }));
        }
        // Called when a pseudo element is removed from an element.
        pseudoElementRemoved(parentId, pseudoElementId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'DOM.pseudoElementRemoved',
                params: {
                    parentId: parentId,
                    pseudoElementId: pseudoElementId,
                },
            }));
        }
    }
    DOMDomain.DOMFrontend = DOMFrontend;
})(DOMDomain || (DOMDomain = {}));
// CSS
// This domain exposes CSS read/write operations. All CSS objects (stylesheets, rules, and styles) have an associated 'id' used in subsequent operations on the related object. Each object type has a specific 'id' structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). A client can also discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method (or keeping track of the <code>styleSheetAdded</code>/<code>styleSheetRemoved</code> events) and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods.
export var CSSDomain;
(function (CSSDomain) {
    class CSSFrontend {
        // Fires whenever a MediaQuery result changes (for example, after a browser window has been resized.) The current implementation considers only viewport-dependent media features.
        mediaQueryResultChanged() {
            __inspectorSendEvent(JSON.stringify({
                method: 'CSS.mediaQueryResultChanged',
                params: {},
            }));
        }
        // Fires whenever a web font gets loaded.
        fontsUpdated() {
            __inspectorSendEvent(JSON.stringify({ method: 'CSS.fontsUpdated', params: {} }));
        }
        // Fired whenever a stylesheet is changed as a result of the client operation.
        styleSheetChanged(styleSheetId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'CSS.styleSheetChanged',
                params: { styleSheetId: styleSheetId },
            }));
        }
        // Fired whenever an active document stylesheet is added.
        styleSheetAdded(header) {
            __inspectorSendEvent(JSON.stringify({
                method: 'CSS.styleSheetAdded',
                params: { header: header },
            }));
        }
        // Fired whenever an active document stylesheet is removed.
        styleSheetRemoved(styleSheetId) {
            __inspectorSendEvent(JSON.stringify({
                method: 'CSS.styleSheetRemoved',
                params: { styleSheetId: styleSheetId },
            }));
        }
        layoutEditorChange(styleSheetId, changeRange) {
            __inspectorSendEvent(JSON.stringify({
                method: 'CSS.layoutEditorChange',
                params: {
                    styleSheetId: styleSheetId,
                    changeRange: changeRange,
                },
            }));
        }
    }
    CSSDomain.CSSFrontend = CSSFrontend;
})(CSSDomain || (CSSDomain = {}));
//# sourceMappingURL=InspectorBackendCommands.ios.js.map