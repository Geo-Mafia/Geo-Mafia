import { Stylesheet } from './CSS3Parser';
/**
 * Consume a CSS3 parsed stylesheet and convert the rules and selectors to the
 * NativeScript internal JSON representation.
 */
export declare class CSSNativeScript {
    parseStylesheet(stylesheet: Stylesheet): any;
    private parseRules;
    private parseRule;
    private parseAtRule;
    private parseQualifiedRule;
    private ruleBlockToDeclarations;
    private preludeToSelectorsStringArray;
}
