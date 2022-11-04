import { DOMNode } from './dom-node';
export interface InspectorCommands {
    getDocument(): string | DOMNode;
    removeNode(nodeId: number): void;
    getComputedStylesForNode(nodeId: number): string | Array<{
        name: string;
        value: string;
    }>;
    setAttributeAsText(nodeId: number, text: string, name: string): void;
}
export interface InspectorEvents {
    childNodeInserted(parentId: number, lastId: number, node: DOMNode): void;
    childNodeRemoved(parentId: number, nodeId: number): void;
    attributeModified(nodeId: number, attrName: string, attrValue: string): void;
    attributeRemoved(nodeId: number, attrName: string): void;
}
