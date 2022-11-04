import * as inspectorCommandTypes from './InspectorBackendCommands.ios';
export declare class DOMDomainDebugger implements inspectorCommandTypes.DOMDomain.DOMDomainDispatcher {
    private _enabled;
    events: inspectorCommandTypes.DOMDomain.DOMFrontend;
    commands: any;
    constructor();
    get enabled(): boolean;
    enable(): void;
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable(): void;
    getDocument(): {
        root: inspectorCommandTypes.DOMDomain.Node;
    };
    removeNode(params: inspectorCommandTypes.DOMDomain.RemoveNodeMethodArguments): void;
    setAttributeValue(params: inspectorCommandTypes.DOMDomain.SetAttributeValueMethodArguments): void;
    setAttributesAsText(params: inspectorCommandTypes.DOMDomain.SetAttributesAsTextMethodArguments): void;
    removeAttribute(params: inspectorCommandTypes.DOMDomain.RemoveAttributeMethodArguments): void;
    performSearch(params: inspectorCommandTypes.DOMDomain.PerformSearchMethodArguments): {
        searchId: string;
        resultCount: number;
    };
    getSearchResults(params: inspectorCommandTypes.DOMDomain.GetSearchResultsMethodArguments): {
        nodeIds: inspectorCommandTypes.DOMDomain.NodeId[];
    };
    discardSearchResults(params: inspectorCommandTypes.DOMDomain.DiscardSearchResultsMethodArguments): void;
    highlightNode(params: inspectorCommandTypes.DOMDomain.HighlightNodeMethodArguments): void;
    hideHighlight(): void;
    resolveNode(params: inspectorCommandTypes.DOMDomain.ResolveNodeMethodArguments): {
        object: inspectorCommandTypes.RuntimeDomain.RemoteObject;
    };
}
