// Requires
import { getDocument, getComputedStylesForNode, removeNode, setAttributeAsText } from './devtools-elements.common';
import { registerInspectorEvents } from './dom-node';
export * from './devtools-elements-interfaces';
export function attachDOMInspectorEventCallbacks(DOMDomainFrontend) {
    registerInspectorEvents(DOMDomainFrontend);
    const originalChildNodeInserted = DOMDomainFrontend.childNodeInserted;
    DOMDomainFrontend.childNodeInserted = (parentId, lastId, node) => {
        originalChildNodeInserted(parentId, lastId, JSON.stringify(node.toObject()));
    };
}
export function attachDOMInspectorCommandCallbacks(DOMDomainBackend) {
    DOMDomainBackend.getDocument = () => {
        return JSON.stringify(getDocument());
    };
    DOMDomainBackend.getComputedStylesForNode = (nodeId) => {
        return JSON.stringify(getComputedStylesForNode(nodeId));
    };
    DOMDomainBackend.removeNode = removeNode;
    DOMDomainBackend.setAttributeAsText = setAttributeAsText;
}
export function attachCSSInspectorCommandCallbacks(CSSDomainFrontend) {
    // no op
}
//# sourceMappingURL=devtools-elements.android.js.map