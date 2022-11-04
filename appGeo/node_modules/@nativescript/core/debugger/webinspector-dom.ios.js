const inspectorCommands = require('./InspectorBackendCommands');
import * as debuggerDomains from '.';
import { attachDOMInspectorEventCallbacks, attachDOMInspectorCommandCallbacks } from './devtools-elements';
let DOMDomainDebugger = class DOMDomainDebugger {
    constructor() {
        this.events = new inspectorCommands.DOMDomain.DOMFrontend();
        this.commands = {};
        attachDOMInspectorEventCallbacks(this.events);
        attachDOMInspectorCommandCallbacks(this.commands);
        // By default start enabled because we can miss the "enable event when
        // running with `--debug-brk` -- the frontend will send it before we've been created
        this.enable();
    }
    get enabled() {
        return this._enabled;
    }
    enable() {
        if (debuggerDomains.getDOM()) {
            throw new Error('One DOMDomainDebugger may be enabled at a time.');
        }
        else {
            debuggerDomains.setDOM(this);
        }
        this._enabled = true;
    }
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable() {
        if (debuggerDomains.getDOM() === this) {
            debuggerDomains.setDOM(null);
        }
        this._enabled = false;
    }
    getDocument() {
        const domNode = this.commands.getDocument();
        return { root: domNode };
    }
    removeNode(params) {
        this.commands.removeNode(params.nodeId);
    }
    setAttributeValue(params) {
        throw new Error('Method not implemented.');
    }
    setAttributesAsText(params) {
        this.commands.setAttributeAsText(params.nodeId, params.text, params.name);
    }
    removeAttribute(params) {
        throw new Error('Method not implemented.');
    }
    performSearch(params) {
        return null;
    }
    getSearchResults(params) {
        return null;
    }
    discardSearchResults(params) {
        return;
    }
    highlightNode(params) {
        return;
    }
    hideHighlight() {
        return;
    }
    resolveNode(params) {
        return null;
    }
};
DOMDomainDebugger = __decorate([
    inspectorCommands.DomainDispatcher('DOM'),
    __metadata("design:paramtypes", [])
], DOMDomainDebugger);
export { DOMDomainDebugger };
//# sourceMappingURL=webinspector-dom.ios.js.map