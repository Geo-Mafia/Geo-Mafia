export declare function DomainDispatcher(domain: string): ClassDecorator;
export declare namespace HeapDomain {
    type HeapSnapshotData = string;
    interface GarbageCollection {
        type: any;
        startTime: number;
        endTime: number;
    }
    interface GetPreviewMethodArguments {
        heapObjectId: number;
    }
    interface GetRemoteObjectMethodArguments {
        heapObjectId: number;
        objectGroup?: string;
    }
    interface HeapDomainDispatcher {
        enable(): void;
        disable(): void;
        gc(): void;
        snapshot(): {
            timestamp: number;
            snapshotData: HeapSnapshotData;
        };
        startTracking(): void;
        stopTracking(): void;
        getPreview(params: GetPreviewMethodArguments): {
            string?: string;
            functionDetails?: DebuggerDomain.FunctionDetails;
            preview?: RuntimeDomain.ObjectPreview;
        };
        getRemoteObject(params: GetRemoteObjectMethodArguments): {
            result: RuntimeDomain.RemoteObject;
        };
    }
    class HeapFrontend {
        garbageCollected(collection: GarbageCollection): void;
        trackingStart(timestamp: number, snapshotData: HeapSnapshotData): void;
        trackingComplete(timestamp: number, snapshotData: HeapSnapshotData): void;
    }
}
export declare namespace DebuggerDomain {
    type BreakpointId = string;
    type BreakpointActionIdentifier = number;
    type ScriptId = string;
    type CallFrameId = string;
    interface Location {
        scriptId: ScriptId;
        lineNumber: number;
        columnNumber?: number;
    }
    interface BreakpointAction {
        type: any;
        data?: string;
        id?: BreakpointActionIdentifier;
    }
    interface BreakpointOptions {
        condition?: string;
        actions?: BreakpointAction[];
        autoContinue?: boolean;
        ignoreCount?: number;
    }
    interface FunctionDetails {
        location: Location;
        name?: string;
        displayName?: string;
        scopeChain?: Scope[];
    }
    interface CallFrame {
        callFrameId: CallFrameId;
        functionName: string;
        location: Location;
        scopeChain: Scope[];
        this: RuntimeDomain.RemoteObject;
        isTailDeleted: boolean;
    }
    interface Scope {
        object: RuntimeDomain.RemoteObject;
        type: any;
        name?: string;
        location?: Location;
        empty?: boolean;
    }
    interface ProbeSample {
        probeId: BreakpointActionIdentifier;
        sampleId: number;
        batchId: number;
        timestamp: number;
        payload: RuntimeDomain.RemoteObject;
    }
    interface AssertPauseReason {
        message?: string;
    }
    interface BreakpointPauseReason {
        breakpointId: string;
    }
    interface CSPViolationPauseReason {
        directive: string;
    }
    interface SetBreakpointsActiveMethodArguments {
        active: boolean;
    }
    interface SetBreakpointByUrlMethodArguments {
        lineNumber: number;
        url?: string;
        urlRegex?: string;
        columnNumber?: number;
        options?: BreakpointOptions;
    }
    interface SetBreakpointMethodArguments {
        location: Location;
        options?: BreakpointOptions;
    }
    interface RemoveBreakpointMethodArguments {
        breakpointId: BreakpointId;
    }
    interface ContinueToLocationMethodArguments {
        location: Location;
    }
    interface SearchInContentMethodArguments {
        scriptId: ScriptId;
        query: string;
        caseSensitive?: boolean;
        isRegex?: boolean;
    }
    interface GetScriptSourceMethodArguments {
        scriptId: ScriptId;
    }
    interface SetScriptSourceMethodArguments {
        scriptUrl: string;
        scriptSource: string;
    }
    interface GetFunctionDetailsMethodArguments {
        functionId: RuntimeDomain.RemoteObjectId;
    }
    interface SetPauseOnExceptionsMethodArguments {
        state: any;
    }
    interface SetPauseOnAssertionsMethodArguments {
        enabled: boolean;
    }
    interface EvaluateOnCallFrameMethodArguments {
        callFrameId: CallFrameId;
        expression: string;
        objectGroup?: string;
        includeCommandLineAPI?: boolean;
        doNotPauseOnExceptionsAndMuteConsole?: boolean;
        returnByValue?: boolean;
        generatePreview?: boolean;
        saveResult?: boolean;
    }
    interface SetOverlayMessageMethodArguments {
        message?: string;
    }
    interface DebuggerDomainDispatcher {
        enable(): void;
        disable(): void;
        setBreakpointsActive(params: SetBreakpointsActiveMethodArguments): void;
        setBreakpointByUrl(params: SetBreakpointByUrlMethodArguments): {
            breakpointId: BreakpointId;
            locations: Location[];
        };
        setBreakpoint(params: SetBreakpointMethodArguments): {
            breakpointId: BreakpointId;
            actualLocation: Location;
        };
        removeBreakpoint(params: RemoveBreakpointMethodArguments): void;
        continueToLocation(params: ContinueToLocationMethodArguments): void;
        stepOver(): void;
        stepInto(): void;
        stepOut(): void;
        pause(): void;
        resume(): void;
        searchInContent(params: SearchInContentMethodArguments): {
            result: GenericTypesDomain.SearchMatch[];
        };
        getScriptSource(params: GetScriptSourceMethodArguments): {
            scriptSource: string;
        };
        setScriptSource(params: SetScriptSourceMethodArguments): void;
        getFunctionDetails(params: GetFunctionDetailsMethodArguments): {
            details: FunctionDetails;
        };
        setPauseOnExceptions(params: SetPauseOnExceptionsMethodArguments): void;
        setPauseOnAssertions(params: SetPauseOnAssertionsMethodArguments): void;
        evaluateOnCallFrame(params: EvaluateOnCallFrameMethodArguments): {
            result: RuntimeDomain.RemoteObject;
            wasThrown?: boolean;
            savedResultIndex?: number;
        };
        setOverlayMessage(params: SetOverlayMessageMethodArguments): void;
    }
    class DebuggerFrontend {
        globalObjectCleared(): void;
        scriptParsed(scriptId: ScriptId, url: string, startLine: number, startColumn: number, endLine: number, endColumn: number, isContentScript?: boolean, sourceURL?: string, sourceMapURL?: string): void;
        scriptFailedToParse(url: string, scriptSource: string, startLine: number, errorLine: number, errorMessage: string): void;
        breakpointResolved(breakpointId: BreakpointId, location: Location): void;
        paused(callFrames: CallFrame[], reason: any, data?: Object): void;
        resumed(): void;
        didSampleProbe(sample: ProbeSample): void;
        playBreakpointActionSound(breakpointActionId: BreakpointActionIdentifier): void;
    }
}
export declare namespace RuntimeDomain {
    type RemoteObjectId = string;
    type ExecutionContextId = number;
    interface RemoteObject {
        type: any;
        subtype?: any;
        className?: string;
        value?: any;
        description?: string;
        objectId?: RemoteObjectId;
        size?: number;
        classPrototype?: RemoteObject;
        preview?: ObjectPreview;
    }
    interface ObjectPreview {
        type: any;
        subtype?: any;
        description?: string;
        lossless: boolean;
        overflow?: boolean;
        properties?: PropertyPreview[];
        entries?: EntryPreview[];
        size?: number;
    }
    interface PropertyPreview {
        name: string;
        type: any;
        subtype?: any;
        value?: string;
        valuePreview?: ObjectPreview;
        internal?: boolean;
    }
    interface EntryPreview {
        key?: ObjectPreview;
        value: ObjectPreview;
    }
    interface CollectionEntry {
        key?: RemoteObject;
        value: RemoteObject;
    }
    interface PropertyDescriptor {
        name: string;
        value?: RemoteObject;
        writable?: boolean;
        get?: RemoteObject;
        set?: RemoteObject;
        configurable: boolean;
        enumerable: boolean;
        wasThrown?: boolean;
        isOwn?: boolean;
        symbol?: RemoteObject;
        nativeGetter?: boolean;
    }
    interface InternalPropertyDescriptor {
        name: string;
        value?: RemoteObject;
    }
    interface CallArgument {
        value?: any;
        objectId?: RemoteObjectId;
    }
    interface ExecutionContextDescription {
        id: ExecutionContextId;
        isPageContext: boolean;
        name: string;
        frameId: NetworkDomain.FrameId;
    }
    interface ErrorRange {
        startOffset: number;
        endOffset: number;
    }
    interface StructureDescription {
        fields?: string[];
        optionalFields?: string[];
        constructorName?: string;
        prototypeStructure?: StructureDescription;
        isImprecise?: boolean;
    }
    interface TypeSet {
        isFunction: boolean;
        isUndefined: boolean;
        isNull: boolean;
        isBoolean: boolean;
        isInteger: boolean;
        isNumber: boolean;
        isString: boolean;
        isObject: boolean;
        isSymbol: boolean;
    }
    interface TypeDescription {
        isValid: boolean;
        leastCommonAncestor?: string;
        typeSet?: TypeSet;
        structures?: StructureDescription[];
        isTruncated?: boolean;
    }
    interface TypeLocation {
        typeInformationDescriptor: number;
        sourceID: string;
        divot: number;
    }
    interface BasicBlock {
        startOffset: number;
        endOffset: number;
        hasExecuted: boolean;
        executionCount: number;
    }
    const enum SyntaxErrorType {
        None = 0,
        Irrecoverable = 1,
        UnterminatedLiteral = 2,
        Recoverable = 3
    }
    interface ParseMethodArguments {
        source: string;
    }
    interface EvaluateMethodArguments {
        expression: string;
        objectGroup?: string;
        includeCommandLineAPI?: boolean;
        doNotPauseOnExceptionsAndMuteConsole?: boolean;
        contextId?: ExecutionContextId;
        returnByValue?: boolean;
        generatePreview?: boolean;
        saveResult?: boolean;
    }
    interface CallFunctionOnMethodArguments {
        objectId: RemoteObjectId;
        functionDeclaration: string;
        arguments?: CallArgument[];
        doNotPauseOnExceptionsAndMuteConsole?: boolean;
        returnByValue?: boolean;
        generatePreview?: boolean;
    }
    interface GetPropertiesMethodArguments {
        objectId: RemoteObjectId;
        ownProperties?: boolean;
        generatePreview?: boolean;
    }
    interface GetDisplayablePropertiesMethodArguments {
        objectId: RemoteObjectId;
        generatePreview?: boolean;
    }
    interface GetCollectionEntriesMethodArguments {
        objectId: RemoteObjectId;
        objectGroup?: string;
        startIndex?: number;
        numberToFetch?: number;
    }
    interface SaveResultMethodArguments {
        value: CallArgument;
        contextId?: ExecutionContextId;
    }
    interface ReleaseObjectMethodArguments {
        objectId: RemoteObjectId;
    }
    interface ReleaseObjectGroupMethodArguments {
        objectGroup: string;
    }
    interface GetRuntimeTypesForVariablesAtOffsetsMethodArguments {
        locations: TypeLocation[];
    }
    interface GetBasicBlocksMethodArguments {
        sourceID: string;
    }
    interface RuntimeDomainDispatcher {
        parse(params: ParseMethodArguments): {
            result: SyntaxErrorType;
            message?: string;
            range?: ErrorRange;
        };
        evaluate(params: EvaluateMethodArguments): {
            result: RemoteObject;
            wasThrown?: boolean;
            savedResultIndex?: number;
        };
        callFunctionOn(params: CallFunctionOnMethodArguments): {
            result: RemoteObject;
            wasThrown?: boolean;
        };
        getProperties(params: GetPropertiesMethodArguments): {
            result: PropertyDescriptor[];
            internalProperties?: InternalPropertyDescriptor[];
        };
        getDisplayableProperties(params: GetDisplayablePropertiesMethodArguments): {
            properties: PropertyDescriptor[];
            internalProperties?: InternalPropertyDescriptor[];
        };
        getCollectionEntries(params: GetCollectionEntriesMethodArguments): {
            entries: CollectionEntry[];
        };
        saveResult(params: SaveResultMethodArguments): {
            savedResultIndex?: number;
        };
        releaseObject(params: ReleaseObjectMethodArguments): void;
        releaseObjectGroup(params: ReleaseObjectGroupMethodArguments): void;
        enable(): void;
        disable(): void;
        getRuntimeTypesForVariablesAtOffsets(params: GetRuntimeTypesForVariablesAtOffsetsMethodArguments): {
            types: TypeDescription[];
        };
        enableTypeProfiler(): void;
        disableTypeProfiler(): void;
        enableControlFlowProfiler(): void;
        disableControlFlowProfiler(): void;
        getBasicBlocks(params: GetBasicBlocksMethodArguments): {
            basicBlocks: BasicBlock[];
        };
    }
    class RuntimeFrontend {
        executionContextCreated(context: ExecutionContextDescription): void;
    }
}
export declare namespace ConsoleDomain {
    interface ConsoleMessage {
        source: any;
        level: any;
        text: string;
        type?: any;
        url?: string;
        line?: number;
        column?: number;
        repeatCount?: number;
        parameters?: RuntimeDomain.RemoteObject[];
        stackTrace?: CallFrame[];
        networkRequestId?: NetworkDomain.RequestId;
    }
    interface CallFrame {
        functionName: string;
        url: string;
        scriptId: DebuggerDomain.ScriptId;
        lineNumber: number;
        columnNumber: number;
    }
    interface SetMonitoringXHREnabledMethodArguments {
        enabled: boolean;
    }
    interface AddInspectedNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface ConsoleDomainDispatcher {
        enable(): void;
        disable(): void;
        clearMessages(): void;
        setMonitoringXHREnabled(params: SetMonitoringXHREnabledMethodArguments): void;
        addInspectedNode(params: AddInspectedNodeMethodArguments): void;
    }
    class ConsoleFrontend {
        messageAdded(message: ConsoleMessage): void;
        messageRepeatCountUpdated(count: number): void;
        messagesCleared(): void;
        heapSnapshot(timestamp: number, snapshotData: HeapDomain.HeapSnapshotData, title?: string): void;
    }
}
export declare namespace GenericTypesDomain {
    interface SearchMatch {
        lineNumber: number;
        lineContent: string;
    }
}
export declare namespace PageDomain {
    type ScriptIdentifier = string;
    interface Frame {
        id: string;
        parentId?: string;
        loaderId: NetworkDomain.LoaderId;
        name?: string;
        url: string;
        securityOrigin: string;
        mimeType: string;
    }
    interface FrameResource {
        url: string;
        type: ResourceType;
        mimeType: string;
        failed?: boolean;
        canceled?: boolean;
        sourceMapURL?: string;
    }
    interface FrameResourceTree {
        frame: Frame;
        childFrames?: FrameResourceTree[];
        resources: FrameResource[];
    }
    interface SearchResult {
        url: string;
        frameId: NetworkDomain.FrameId;
        matchesCount: number;
        requestId?: NetworkDomain.RequestId;
    }
    interface Cookie {
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        size: number;
        httpOnly: boolean;
        secure: boolean;
        session: boolean;
    }
    const enum ResourceType {
        Document = 0,
        Stylesheet = 1,
        Image = 2,
        Font = 3,
        Script = 4,
        XHR = 5,
        WebSocket = 6,
        Other = 7
    }
    const enum CoordinateSystem {
        Viewport = 0,
        Page = 1
    }
    interface AddScriptToEvaluateOnLoadMethodArguments {
        scriptSource: string;
    }
    interface RemoveScriptToEvaluateOnLoadMethodArguments {
        identifier: ScriptIdentifier;
    }
    interface ReloadMethodArguments {
        ignoreCache?: boolean;
        scriptToEvaluateOnLoad?: string;
    }
    interface NavigateMethodArguments {
        url: string;
    }
    interface DeleteCookieMethodArguments {
        cookieName: string;
        url: string;
    }
    interface GetResourceContentMethodArguments {
        frameId: NetworkDomain.FrameId;
        url: string;
    }
    interface SearchInResourceMethodArguments {
        frameId: NetworkDomain.FrameId;
        url: string;
        query: string;
        caseSensitive?: boolean;
        isRegex?: boolean;
        requestId?: NetworkDomain.RequestId;
    }
    interface SearchInResourcesMethodArguments {
        text: string;
        caseSensitive?: boolean;
        isRegex?: boolean;
    }
    interface SetDocumentContentMethodArguments {
        frameId: NetworkDomain.FrameId;
        html: string;
    }
    interface SetShowPaintRectsMethodArguments {
        result: boolean;
    }
    interface SetScriptExecutionDisabledMethodArguments {
        value: boolean;
    }
    interface SetTouchEmulationEnabledMethodArguments {
        enabled: boolean;
    }
    interface SetEmulatedMediaMethodArguments {
        media: string;
    }
    interface SetCompositingBordersVisibleMethodArguments {
        visible: boolean;
    }
    interface SnapshotNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface SnapshotRectMethodArguments {
        x: number;
        y: number;
        width: number;
        height: number;
        coordinateSystem: CoordinateSystem;
    }
    interface HandleJavaScriptDialogMethodArguments {
        accept: boolean;
        promptText?: string;
    }
    interface PageDomainDispatcher {
        enable(): void;
        disable(): void;
        addScriptToEvaluateOnLoad(params: AddScriptToEvaluateOnLoadMethodArguments): {
            identifier: ScriptIdentifier;
        };
        removeScriptToEvaluateOnLoad(params: RemoveScriptToEvaluateOnLoadMethodArguments): void;
        reload(params: ReloadMethodArguments): void;
        navigate(params: NavigateMethodArguments): void;
        getCookies(): {
            cookies: Cookie[];
        };
        deleteCookie(params: DeleteCookieMethodArguments): void;
        getResourceTree(): {
            frameTree: FrameResourceTree;
        };
        getResourceContent(params: GetResourceContentMethodArguments): {
            content: string;
            base64Encoded: boolean;
        };
        searchInResource(params: SearchInResourceMethodArguments): {
            result: GenericTypesDomain.SearchMatch[];
        };
        searchInResources(params: SearchInResourcesMethodArguments): {
            result: SearchResult[];
        };
        setDocumentContent(params: SetDocumentContentMethodArguments): void;
        setShowPaintRects(params: SetShowPaintRectsMethodArguments): void;
        getScriptExecutionStatus(): {
            result: any;
        };
        setScriptExecutionDisabled(params: SetScriptExecutionDisabledMethodArguments): void;
        setTouchEmulationEnabled(params: SetTouchEmulationEnabledMethodArguments): void;
        setEmulatedMedia(params: SetEmulatedMediaMethodArguments): void;
        getCompositingBordersVisible(): {
            result: boolean;
        };
        setCompositingBordersVisible(params: SetCompositingBordersVisibleMethodArguments): void;
        snapshotNode(params: SnapshotNodeMethodArguments): {
            dataURL: string;
        };
        snapshotRect(params: SnapshotRectMethodArguments): {
            dataURL: string;
        };
        handleJavaScriptDialog(params: HandleJavaScriptDialogMethodArguments): void;
        archive(): {
            data: string;
        };
    }
    class PageFrontend {
        domContentEventFired(timestamp: number): void;
        loadEventFired(timestamp: number): void;
        frameNavigated(frame: Frame): void;
        frameDetached(frameId: NetworkDomain.FrameId): void;
        frameStartedLoading(frameId: NetworkDomain.FrameId): void;
        frameStoppedLoading(frameId: NetworkDomain.FrameId): void;
        frameScheduledNavigation(frameId: NetworkDomain.FrameId, delay: number): void;
        frameClearedScheduledNavigation(frameId: NetworkDomain.FrameId): void;
        javascriptDialogOpening(message: string): void;
        javascriptDialogClosed(): void;
        scriptsEnabled(isEnabled: boolean): void;
    }
}
export declare namespace NetworkDomain {
    type LoaderId = string;
    type FrameId = string;
    type RequestId = string;
    type Timestamp = number;
    interface Headers {
    }
    interface ResourceTiming {
        startTime: number;
        domainLookupStart: number;
        domainLookupEnd: number;
        connectStart: number;
        connectEnd: number;
        secureConnectionStart: number;
        requestStart: number;
        responseStart: number;
    }
    interface Request {
        url: string;
        method: string;
        headers: Headers;
        postData?: string;
    }
    interface Response {
        url: string;
        status: number;
        statusText: string;
        headers: Headers;
        headersText?: string;
        mimeType: string;
        requestHeaders?: Headers;
        requestHeadersText?: string;
        fromDiskCache?: boolean;
        timing?: ResourceTiming;
    }
    interface WebSocketRequest {
        headers: Headers;
    }
    interface WebSocketResponse {
        status: number;
        statusText: string;
        headers: Headers;
    }
    interface WebSocketFrame {
        opcode: number;
        mask: boolean;
        payloadData: string;
    }
    interface CachedResource {
        url: string;
        type: PageDomain.ResourceType;
        response?: Response;
        bodySize: number;
        sourceMapURL?: string;
    }
    interface Initiator {
        type: any;
        stackTrace?: ConsoleDomain.CallFrame[];
        url?: string;
        lineNumber?: number;
    }
    interface SetExtraHTTPHeadersMethodArguments {
        headers: Headers;
    }
    interface GetResponseBodyMethodArguments {
        requestId: RequestId;
    }
    interface SetCacheDisabledMethodArguments {
        cacheDisabled: boolean;
    }
    interface LoadResourceMethodArguments {
        frameId: FrameId;
        url: string;
    }
    interface NetworkDomainDispatcher {
        enable(): void;
        disable(): void;
        setExtraHTTPHeaders(params: SetExtraHTTPHeadersMethodArguments): void;
        getResponseBody(params: GetResponseBodyMethodArguments): {
            body: string;
            base64Encoded: boolean;
        };
        setCacheDisabled(params: SetCacheDisabledMethodArguments): void;
        loadResource(params: LoadResourceMethodArguments): {
            content: string;
            mimeType: string;
            status: number;
        };
    }
    class NetworkFrontend {
        requestWillBeSent(requestId: RequestId, frameId: FrameId, loaderId: LoaderId, documentURL: string, request: Request, timestamp: Timestamp, initiator: Initiator, redirectResponse?: Response, type?: PageDomain.ResourceType): void;
        requestServedFromCache(requestId: RequestId): void;
        responseReceived(requestId: RequestId, frameId: FrameId, loaderId: LoaderId, timestamp: Timestamp, type: PageDomain.ResourceType, response: Response): void;
        dataReceived(requestId: RequestId, timestamp: Timestamp, dataLength: number, encodedDataLength: number): void;
        loadingFinished(requestId: RequestId, timestamp: Timestamp, sourceMapURL?: string): void;
        loadingFailed(requestId: RequestId, timestamp: Timestamp, errorText: string, canceled?: boolean): void;
        requestServedFromMemoryCache(requestId: RequestId, frameId: FrameId, loaderId: LoaderId, documentURL: string, timestamp: Timestamp, initiator: Initiator, resource: CachedResource): void;
        webSocketWillSendHandshakeRequest(requestId: RequestId, timestamp: Timestamp, request: WebSocketRequest): void;
        webSocketHandshakeResponseReceived(requestId: RequestId, timestamp: Timestamp, response: WebSocketResponse): void;
        webSocketCreated(requestId: RequestId, url: string): void;
        webSocketClosed(requestId: RequestId, timestamp: Timestamp): void;
        webSocketFrameReceived(requestId: RequestId, timestamp: Timestamp, response: WebSocketFrame): void;
        webSocketFrameError(requestId: RequestId, timestamp: Timestamp, errorMessage: string): void;
        webSocketFrameSent(requestId: RequestId, timestamp: Timestamp, response: WebSocketFrame): void;
    }
}
export declare namespace DOMDomain {
    type NodeId = number;
    type BackendNodeId = number;
    interface Node {
        nodeId: NodeId;
        nodeType: number;
        nodeName: string;
        localName: string;
        nodeValue: string;
        childNodeCount?: number;
        children?: Node[];
        attributes?: string[];
        documentURL?: string;
        baseURL?: string;
        publicId?: string;
        systemId?: string;
        xmlVersion?: string;
        name?: string;
        value?: string;
        pseudoType?: PseudoType;
        shadowRootType?: ShadowRootType;
        frameId?: NetworkDomain.FrameId;
        contentDocument?: Node;
        shadowRoots?: Node[];
        templateContent?: Node;
        pseudoElements?: Node[];
        role?: string;
        contentSecurityPolicyHash?: string;
    }
    interface RGBAColor {
        r: number;
        g: number;
        b: number;
        a?: number;
    }
    interface HighlightConfig {
        showInfo?: boolean;
        contentColor?: RGBAColor;
        paddingColor?: RGBAColor;
        borderColor?: RGBAColor;
        marginColor?: RGBAColor;
    }
    const enum PseudoType {
        Before = 0,
        After = 1
    }
    const enum ShadowRootType {
        UserAgent = 0,
        Open = 1,
        Closed = 2
    }
    const enum LiveRegionRelevant {
        Additions = 0,
        Removals = 1,
        Text = 2
    }
    interface RemoveNodeMethodArguments {
        nodeId: NodeId;
    }
    interface SetAttributeValueMethodArguments {
        nodeId: NodeId;
        name: string;
        value: string;
    }
    interface SetAttributesAsTextMethodArguments {
        nodeId: NodeId;
        text: string;
        name?: string;
    }
    interface RemoveAttributeMethodArguments {
        nodeId: NodeId;
        name: string;
    }
    interface PerformSearchMethodArguments {
        query: string;
        nodeIds?: NodeId[];
    }
    interface GetSearchResultsMethodArguments {
        searchId: string;
        fromIndex: number;
        toIndex: number;
    }
    interface DiscardSearchResultsMethodArguments {
        searchId: string;
    }
    interface HighlightNodeMethodArguments {
        highlightConfig: HighlightConfig;
        nodeId?: NodeId;
        objectId?: RuntimeDomain.RemoteObjectId;
    }
    interface ResolveNodeMethodArguments {
        nodeId: NodeId;
        objectGroup?: string;
    }
    interface DOMDomainDispatcher {
        enable(): void;
        disable(): void;
        getDocument(): {
            root: Node;
        };
        removeNode(params: RemoveNodeMethodArguments): void;
        setAttributeValue(params: SetAttributeValueMethodArguments): void;
        setAttributesAsText(params: SetAttributesAsTextMethodArguments): void;
        removeAttribute(params: RemoveAttributeMethodArguments): void;
        performSearch(params: PerformSearchMethodArguments): {
            searchId: string;
            resultCount: number;
        };
        getSearchResults(params: GetSearchResultsMethodArguments): {
            nodeIds: NodeId[];
        };
        discardSearchResults(params: DiscardSearchResultsMethodArguments): void;
        highlightNode(params: HighlightNodeMethodArguments): void;
        hideHighlight(): void;
        resolveNode(params: ResolveNodeMethodArguments): {
            object: RuntimeDomain.RemoteObject;
        };
    }
    class DOMFrontend {
        documentUpdated(): void;
        setChildNodes(parentId: NodeId, nodes: Node[]): void;
        attributeModified(nodeId: NodeId, name: string, value: string): void;
        attributeRemoved(nodeId: NodeId, name: string): void;
        inlineStyleInvalidated(nodeIds: NodeId[]): void;
        characterDataModified(nodeId: NodeId, characterData: string): void;
        childNodeCountUpdated(nodeId: NodeId, childNodeCount: number): void;
        childNodeInserted(parentNodeId: NodeId, previousNodeId: NodeId, node: Node): void;
        childNodeRemoved(parentNodeId: NodeId, nodeId: NodeId): void;
        shadowRootPushed(hostId: NodeId, root: Node): void;
        shadowRootPopped(hostId: NodeId, rootId: NodeId): void;
        pseudoElementAdded(parentId: NodeId, pseudoElement: Node): void;
        pseudoElementRemoved(parentId: NodeId, pseudoElementId: NodeId): void;
    }
}
export declare namespace CSSDomain {
    type StyleSheetId = string;
    interface PseudoElementMatches {
        pseudoType: DOMDomain.PseudoType;
        matches: RuleMatch[];
    }
    interface InheritedStyleEntry {
        inlineStyle?: CSSStyle;
        matchedCSSRules: RuleMatch[];
    }
    interface RuleMatch {
        rule: CSSRule;
        matchingSelectors: number[];
    }
    interface Value {
        text: string;
        range?: SourceRange;
    }
    interface SelectorList {
        selectors: Value[];
        text: string;
    }
    interface CSSStyleSheetHeader {
        styleSheetId: StyleSheetId;
        frameId: string;
        sourceURL: string;
        sourceMapURL?: string;
        origin: StyleSheetOrigin;
        title: string;
        ownerNode?: DOMDomain.BackendNodeId;
        disabled: boolean;
        hasSourceURL?: boolean;
        isInline: boolean;
        startLine: number;
        startColumn: number;
    }
    interface CSSRule {
        styleSheetId?: StyleSheetId;
        selectorList: SelectorList;
        origin: StyleSheetOrigin;
        style: CSSStyle;
        media?: CSSMedia[];
    }
    interface SourceRange {
        startLine: number;
        startColumn: number;
        endLine: number;
        endColumn: number;
    }
    interface ShorthandEntry {
        name: string;
        value: string;
        important?: boolean;
    }
    interface CSSComputedStyleProperty {
        name: string;
        value: string;
    }
    interface CSSStyle {
        styleSheetId?: StyleSheetId;
        cssProperties: CSSProperty[];
        shorthandEntries: ShorthandEntry[];
        cssText?: string;
        range?: SourceRange;
    }
    interface CSSProperty {
        name: string;
        value: string;
        important?: boolean;
        implicit?: boolean;
        text?: string;
        parsedOk?: boolean;
        disabled?: boolean;
        range?: SourceRange;
    }
    interface CSSMedia {
        text: string;
        source: any;
        sourceURL?: string;
        range?: SourceRange;
        styleSheetId?: StyleSheetId;
        mediaList?: MediaQuery[];
    }
    interface MediaQuery {
        expressions: MediaQueryExpression[];
        active: boolean;
    }
    interface MediaQueryExpression {
        value: number;
        unit: string;
        feature: string;
        valueRange?: SourceRange;
        computedLength?: number;
    }
    interface PlatformFontUsage {
        familyName: string;
        isCustomFont: boolean;
        glyphCount: number;
    }
    interface CSSKeyframesRule {
        animationName: Value;
        keyframes: CSSKeyframeRule[];
    }
    interface CSSKeyframeRule {
        styleSheetId?: StyleSheetId;
        origin: StyleSheetOrigin;
        keyText: Value;
        style: CSSStyle;
    }
    interface StyleDeclarationEdit {
        styleSheetId: StyleSheetId;
        range: SourceRange;
        text: string;
    }
    const enum StyleSheetOrigin {
        Injected = 0,
        UserAgent = 1,
        Inspector = 2,
        Regular = 3
    }
    interface GetMatchedStylesForNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface GetInlineStylesForNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface GetComputedStyleForNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface GetPlatformFontsForNodeMethodArguments {
        nodeId: DOMDomain.NodeId;
    }
    interface GetStyleSheetTextMethodArguments {
        styleSheetId: StyleSheetId;
    }
    interface CSSDomainDispatcher {
        enable(): void;
        disable(): void;
        getMatchedStylesForNode(params: GetMatchedStylesForNodeMethodArguments): {
            inlineStyle?: CSSStyle;
            attributesStyle?: CSSStyle;
            matchedCSSRules?: RuleMatch[];
            pseudoElements?: PseudoElementMatches[];
            inherited?: InheritedStyleEntry[];
            cssKeyframesRules?: CSSKeyframesRule[];
        };
        getInlineStylesForNode(params: GetInlineStylesForNodeMethodArguments): {
            inlineStyle?: CSSStyle;
            attributesStyle?: CSSStyle;
        };
        getComputedStyleForNode(params: GetComputedStyleForNodeMethodArguments): {
            computedStyle: CSSComputedStyleProperty[];
        };
        getPlatformFontsForNode(params: GetPlatformFontsForNodeMethodArguments): {
            fonts: PlatformFontUsage[];
        };
        getStyleSheetText(params: GetStyleSheetTextMethodArguments): {
            text: string;
        };
    }
    class CSSFrontend {
        mediaQueryResultChanged(): void;
        fontsUpdated(): void;
        styleSheetChanged(styleSheetId: StyleSheetId): void;
        styleSheetAdded(header: CSSStyleSheetHeader): void;
        styleSheetRemoved(styleSheetId: StyleSheetId): void;
        layoutEditorChange(styleSheetId: StyleSheetId, changeRange: SourceRange): void;
    }
}
