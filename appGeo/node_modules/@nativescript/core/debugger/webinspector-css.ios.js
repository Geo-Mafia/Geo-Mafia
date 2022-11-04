const inspectorCommands = require('./InspectorBackendCommands');
import * as debuggerDomains from '.';
import { attachCSSInspectorCommandCallbacks } from './devtools-elements';
let CSSDomainDebugger = class CSSDomainDebugger {
    constructor() {
        this.events = new inspectorCommands.CSSDomain.CSSFrontend();
        this.commands = {};
        attachCSSInspectorCommandCallbacks(this.commands);
        // By default start enabled because we can miss the "enable" event when
        // running with `--debug-brk` -- the frontend will send it before we've been created
        this.enable();
    }
    get enabled() {
        return this._enabled;
    }
    enable() {
        if (debuggerDomains.getCSS()) {
            throw new Error('One CSSDomainDebugger may be enabled at a time.');
        }
        else {
            debuggerDomains.setCSS(this);
        }
        this._enabled = true;
    }
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable() {
        if (debuggerDomains.getCSS() === this) {
            debuggerDomains.setCSS(null);
        }
        this._enabled = false;
    }
    getMatchedStylesForNode(params) {
        return {};
    }
    // Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>.
    getInlineStylesForNode(params) {
        return {};
    }
    // Returns the computed style for a DOM node identified by <code>nodeId</code>.
    getComputedStyleForNode(params) {
        return {
            computedStyle: this.commands.getComputedStylesForNode(params.nodeId),
        };
    }
    // Requests information about platform fonts which we used to render child TextNodes in the given node.
    getPlatformFontsForNode(params) {
        return {
            fonts: [
                {
                    // Font's family name reported by platform.
                    familyName: 'Standard Font',
                    // Indicates if the font was downloaded or resolved locally.
                    isCustomFont: false,
                    // Amount of glyphs that were rendered with this font.
                    glyphCount: 0,
                },
            ],
        };
    }
    // Returns the current textual content and the URL for a stylesheet.
    getStyleSheetText(params) {
        return null;
    }
};
CSSDomainDebugger = __decorate([
    inspectorCommands.DomainDispatcher('CSS'),
    __metadata("design:paramtypes", [])
], CSSDomainDebugger);
export { CSSDomainDebugger };
//# sourceMappingURL=webinspector-css.ios.js.map