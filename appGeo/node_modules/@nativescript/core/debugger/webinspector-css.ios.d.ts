import * as inspectorCommandTypes from './InspectorBackendCommands.ios';
export declare class CSSDomainDebugger implements inspectorCommandTypes.CSSDomain.CSSDomainDispatcher {
    private _enabled;
    events: inspectorCommandTypes.CSSDomain.CSSFrontend;
    commands: any;
    constructor();
    get enabled(): boolean;
    enable(): void;
    /**
     * Disables network tracking, prevents network events from being sent to the client.
     */
    disable(): void;
    getMatchedStylesForNode(params: inspectorCommandTypes.CSSDomain.GetMatchedStylesForNodeMethodArguments): {
        inlineStyle?: inspectorCommandTypes.CSSDomain.CSSStyle;
        attributesStyle?: inspectorCommandTypes.CSSDomain.CSSStyle;
        matchedCSSRules?: inspectorCommandTypes.CSSDomain.RuleMatch[];
        pseudoElements?: inspectorCommandTypes.CSSDomain.PseudoElementMatches[];
        inherited?: inspectorCommandTypes.CSSDomain.InheritedStyleEntry[];
        cssKeyframesRules?: inspectorCommandTypes.CSSDomain.CSSKeyframesRule[];
    };
    getInlineStylesForNode(params: inspectorCommandTypes.CSSDomain.GetInlineStylesForNodeMethodArguments): {
        inlineStyle?: inspectorCommandTypes.CSSDomain.CSSStyle;
        attributesStyle?: inspectorCommandTypes.CSSDomain.CSSStyle;
    };
    getComputedStyleForNode(params: inspectorCommandTypes.CSSDomain.GetComputedStyleForNodeMethodArguments): {
        computedStyle: inspectorCommandTypes.CSSDomain.CSSComputedStyleProperty[];
    };
    getPlatformFontsForNode(params: inspectorCommandTypes.CSSDomain.GetPlatformFontsForNodeMethodArguments): {
        fonts: inspectorCommandTypes.CSSDomain.PlatformFontUsage[];
    };
    getStyleSheetText(params: inspectorCommandTypes.CSSDomain.GetStyleSheetTextMethodArguments): {
        text: string;
    };
}
