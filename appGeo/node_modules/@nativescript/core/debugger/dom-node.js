const registeredDomNodes = {};
const ELEMENT_NODE_TYPE = 1;
const ROOT_NODE_TYPE = 9;
const propertyBlacklist = ['effectivePaddingLeft', 'effectivePaddingBottom', 'effectivePaddingRight', 'effectivePaddingTop', 'effectiveBorderTopWidth', 'effectiveBorderRightWidth', 'effectiveBorderBottomWidth', 'effectiveBorderLeftWidth', 'effectiveMinWidth', 'effectiveMinHeight', 'effectiveWidth', 'effectiveHeight', 'effectiveMarginLeft', 'effectiveMarginTop', 'effectiveMarginRight', 'effectiveMarginBottom', 'nodeName', 'nodeType', 'decodeWidth', 'decodeHeight', 'ng-reflect-items', 'domNode', 'touchListenerIsSet', 'bindingContext', 'nativeView'];
function lazy(action) {
    let _value;
    return () => _value || (_value = action());
}
const percentLengthToStringLazy = lazy(() => require('../ui/styling/style-properties').PercentLength.convertToString);
const getSetPropertiesLazy = lazy(() => require('../ui/core/properties').getSetProperties);
const getComputedCssValuesLazy = lazy(() => require('../ui/core/properties').getComputedCssValues);
export function registerInspectorEvents(inspector) {
    inspectorFrontendInstance = inspector;
}
let inspectorFrontendInstance;
function notifyInspector(callback) {
    if (inspectorFrontendInstance) {
        callback(inspectorFrontendInstance);
    }
}
function valueToString(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }
    else if (typeof value === 'object' && value.unit) {
        return percentLengthToStringLazy()(value);
    }
    else {
        return value + '';
    }
}
function propertyFilter([name, value]) {
    if (name[0] === '_') {
        return false;
    }
    if (value !== null && typeof value === 'object') {
        return false;
    }
    if (propertyBlacklist.indexOf(name) >= 0) {
        return false;
    }
    return true;
}
function registerNode(domNode) {
    registeredDomNodes[domNode.nodeId] = domNode;
}
function unregisterNode(domNode) {
    delete registeredDomNodes[domNode.nodeId];
}
export function getNodeById(id) {
    return registeredDomNodes[id];
}
export class DOMNode {
    constructor(view) {
        this.nodeValue = '';
        this.attributes = [];
        this.viewRef = new WeakRef(view);
        this.nodeType = view.typeName === 'Frame' ? ROOT_NODE_TYPE : ELEMENT_NODE_TYPE;
        this.nodeId = view._domId;
        this.nodeName = view.typeName;
        this.localName = this.nodeName;
        // Load all attributes
        this.loadAttributes();
        registerNode(this);
    }
    loadAttributes() {
        this.attributes = [];
        getSetPropertiesLazy()(this.viewRef.get())
            .filter(propertyFilter)
            .forEach((pair) => this.attributes.push(pair[0], pair[1] + ''));
    }
    get children() {
        const view = this.viewRef.get();
        if (!view) {
            return [];
        }
        const res = [];
        view.eachChild((child) => {
            child.ensureDomNode();
            res.push(child.domNode);
            return true;
        });
        return res;
    }
    onChildAdded(childView) {
        notifyInspector((ins) => {
            const view = this.viewRef.get();
            let previousChild;
            view.eachChild((child) => {
                if (child === childView) {
                    return false;
                }
                previousChild = child;
                return true;
            });
            const index = previousChild ? previousChild._domId : 0;
            childView.ensureDomNode();
            ins.childNodeInserted(this.nodeId, index, childView.domNode);
        });
    }
    onChildRemoved(view) {
        notifyInspector((ins) => {
            ins.childNodeRemoved(this.nodeId, view._domId);
        });
    }
    attributeModified(name, value) {
        notifyInspector((ins) => {
            if (propertyBlacklist.indexOf(name) < 0) {
                ins.attributeModified(this.nodeId, name, valueToString(value));
            }
        });
    }
    attributeRemoved(name) {
        notifyInspector((ins) => {
            ins.attributeRemoved(this.nodeId, name);
        });
    }
    getComputedProperties() {
        const view = this.viewRef.get();
        if (!view) {
            return [];
        }
        const result = getComputedCssValuesLazy()(view)
            .filter((pair) => pair[0][0] !== '_')
            .map((pair) => {
            return {
                name: pair[0],
                value: valueToString(pair[1]),
            };
        });
        return result;
    }
    dispose() {
        unregisterNode(this);
        // this.viewRef.clear();
    }
    toObject() {
        return {
            nodeId: this.nodeId,
            nodeType: this.nodeType,
            nodeName: this.nodeName,
            localName: this.localName,
            nodeValue: this.nodeValue,
            children: this.children.map((c) => c.toObject()),
            attributes: this.attributes,
            backendNodeId: 0,
        };
    }
}
//# sourceMappingURL=dom-node.js.map