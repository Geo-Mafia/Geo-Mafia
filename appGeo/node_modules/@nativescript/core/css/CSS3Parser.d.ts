export interface Stylesheet {
    rules: Rule[];
}
export declare type Rule = QualifiedRule | AtRule;
export interface AtRule {
    type: 'at-rule';
    name: string;
    prelude: InputToken[];
    block: SimpleBlock;
}
export interface QualifiedRule {
    type: 'qualified-rule';
    prelude: InputToken[];
    block: SimpleBlock;
}
export declare type InputToken = '(' | ')' | '{' | '}' | '[' | ']' | ':' | ';' | ',' | ' ' | '^=' | '|=' | '$=' | '*=' | '~=' | '<!--' | '-->' | undefined | /* <EOF-token> */ InputTokenObject | FunctionInputToken | FunctionToken | SimpleBlock | AtKeywordToken;
export declare const enum TokenObjectType {
    /**
     * <string-token>
     */
    string = 1,
    /**
     * <delim-token>
     */
    delim = 2,
    /**
     * <number-token>
     */
    number = 3,
    /**
     * <percentage-token>
     */
    percentage = 4,
    /**
     * <dimension-token>
     */
    dimension = 5,
    /**
     * <ident-token>
     */
    ident = 6,
    /**
     * <url-token>
     */
    url = 7,
    /**
     * <function-token>
     * This is a token indicating a function's leading: <ident-token>(
     */
    functionToken = 8,
    /**
     * <simple-block>
     */
    simpleBlock = 9,
    /**
     * <comment-token>
     */
    comment = 10,
    /**
     * <at-keyword-token>
     */
    atKeyword = 11,
    /**
     * <hash-token>
     */
    hash = 12,
    /**
     * <function>
     * This is a complete consumed function: <function-token>([<component-value> [, <component-value>]*])")"
     */
    function = 14
}
export interface InputTokenObject {
    type: TokenObjectType;
    text: string;
}
/**
 * This is a "<ident>(" token.
 */
export interface FunctionInputToken extends InputTokenObject {
    name: string;
}
/**
 * This is a completely parsed function like "<ident>([component [, component]*])".
 */
export interface FunctionToken extends FunctionInputToken {
    components: any[];
}
export interface SimpleBlock extends InputTokenObject {
    associatedToken: InputToken;
    values: InputToken[];
}
export declare type AtKeywordToken = InputTokenObject;
/**
 * CSS parser following relatively close:
 * CSS Syntax Module Level 3
 * https://www.w3.org/TR/css-syntax-3/
 */
export declare class CSS3Parser {
    private text;
    private nextInputCodePointIndex;
    private reconsumedInputToken;
    private topLevelFlag;
    constructor(text: string);
    /**
     * For testing purposes.
     * This method allows us to run and assert the proper working of the tokenizer.
     */
    tokenize(): InputToken[];
    /**
     * 4.3.1. Consume a token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-token
     */
    private consumeAToken;
    private consumeADelimToken;
    private consumeAWhitespace;
    private consumeAHashToken;
    private consumeCDO;
    private consumeCDC;
    private consumeAMatchToken;
    /**
     * 4.3.2. Consume a numeric token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-numeric-token
     */
    private consumeANumericToken;
    /**
     * 4.3.3. Consume an ident-like token
     * https://www.w3.org/TR/css-syntax-3/#consume-an-ident-like-token
     */
    private consumeAnIdentLikeToken;
    /**
     * 4.3.4. Consume a string token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-string-token
     */
    private consumeAStringToken;
    /**
     * 4.3.5. Consume a url token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-url-token
     */
    private consumeAURLToken;
    /**
     * 4.3.11. Consume a name
     * https://www.w3.org/TR/css-syntax-3/#consume-a-name
     */
    private consumeAName;
    private consumeAtKeyword;
    private consumeAComment;
    private reconsumeTheCurrentInputToken;
    /**
     * 5.3.1. Parse a stylesheet
     * https://www.w3.org/TR/css-syntax-3/#parse-a-stylesheet
     */
    parseAStylesheet(): Stylesheet;
    /**
     * 5.4.1. Consume a list of rules
     * https://www.w3.org/TR/css-syntax-3/#consume-a-list-of-rules
     */
    consumeAListOfRules(): Rule[];
    /**
     * 5.4.2. Consume an at-rule
     * https://www.w3.org/TR/css-syntax-3/#consume-an-at-rule
     */
    consumeAnAtRule(): AtRule;
    /**
     * 5.4.3. Consume a qualified rule
     * https://www.w3.org/TR/css-syntax-3/#consume-a-qualified-rule
     */
    consumeAQualifiedRule(): QualifiedRule;
    /**
     * 5.4.6. Consume a component value
     * https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
     */
    private consumeAComponentValue;
    /**
     * 5.4.7. Consume a simple block
     * https://www.w3.org/TR/css-syntax-3/#consume-a-simple-block
     */
    private consumeASimpleBlock;
    /**
     * 5.4.8. Consume a function
     * https://www.w3.org/TR/css-syntax-3/#consume-a-function
     */
    private consumeAFunction;
}
