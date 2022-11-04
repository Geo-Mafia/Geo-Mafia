import '../../../globals';
import * as cssParser from '../../../css';
/**
 * An interface describing the shape of a type on which the selectors may apply.
 * Note, the ui/core/view.View implements Node.
 */
export interface Node {
    parent?: Node;
    id?: string;
    nodeName?: string;
    cssType?: string;
    cssClasses?: Set<string>;
    cssPseudoClasses?: Set<string>;
    getChildIndex?(node: Node): number;
    getChildAt?(index: number): Node;
}
export interface Declaration {
    property: string;
    value: string;
}
export declare type ChangeMap<T extends Node> = Map<T, Changes>;
export interface Changes {
    attributes?: Set<string>;
    pseudoClasses?: Set<string>;
}
declare const enum Rarity {
    Invalid = 4,
    Id = 3,
    Class = 2,
    Type = 1,
    PseudoClass = 0,
    Attribute = 0,
    Universal = 0,
    Inline = 0
}
interface LookupSorter {
    sortById(id: string, sel: SelectorCore): any;
    sortByClass(cssClass: string, sel: SelectorCore): any;
    sortByType(cssType: string, sel: SelectorCore): any;
    sortAsUniversal(sel: SelectorCore): any;
}
declare type Combinator = '+' | '>' | '~' | ' ';
export declare abstract class SelectorCore {
    pos: number;
    specificity: number;
    rarity: Rarity;
    combinator: Combinator;
    ruleset: RuleSet;
    /**
     * Dynamic selectors depend on attributes and pseudo classes.
     */
    dynamic: boolean;
    abstract match(node: Node): boolean;
    /**
     * If the selector is static returns if it matches the node.
     * If the selector is dynamic returns if it may match the node, and accumulates any changes that may affect its state.
     */
    abstract accumulateChanges(node: Node, map: ChangeAccumulator): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
export declare abstract class SimpleSelector extends SelectorCore {
    accumulateChanges(node: Node, map?: ChangeAccumulator): boolean;
    mayMatch(node: Node): boolean;
    trackChanges(node: Node, map: ChangeAccumulator): void;
}
export declare class InvalidSelector extends SimpleSelector {
    e: Error;
    constructor(e: Error);
    toString(): string;
    match(node: Node): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
export declare class UniversalSelector extends SimpleSelector {
    toString(): string;
    match(node: Node): boolean;
}
export declare class IdSelector extends SimpleSelector {
    id: string;
    constructor(id: string);
    toString(): string;
    match(node: Node): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
export declare class TypeSelector extends SimpleSelector {
    cssType: string;
    constructor(cssType: string);
    toString(): string;
    match(node: Node): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
export declare class ClassSelector extends SimpleSelector {
    cssClass: string;
    constructor(cssClass: string);
    toString(): string;
    match(node: Node): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
declare type AttributeTest = '=' | '^=' | '$=' | '*=' | '=' | '~=' | '|=';
export declare class AttributeSelector extends SimpleSelector {
    attribute: string;
    test?: AttributeTest;
    value?: string;
    constructor(attribute: string, test?: AttributeTest, value?: string);
    toString(): string;
    match(node: Node): boolean;
    mayMatch(node: Node): boolean;
    trackChanges(node: Node, map: ChangeAccumulator): void;
}
export declare class PseudoClassSelector extends SimpleSelector {
    cssPseudoClass: string;
    constructor(cssPseudoClass: string);
    toString(): string;
    match(node: Node): boolean;
    mayMatch(node: Node): boolean;
    trackChanges(node: Node, map: ChangeAccumulator): void;
}
export declare class SimpleSelectorSequence extends SimpleSelector {
    selectors: SimpleSelector[];
    private head;
    constructor(selectors: SimpleSelector[]);
    toString(): string;
    match(node: Node): boolean;
    mayMatch(node: Node): boolean;
    trackChanges(node: any, map: any): void;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
}
export declare class Selector extends SelectorCore {
    selectors: SimpleSelector[];
    private groups;
    private last;
    constructor(selectors: SimpleSelector[]);
    toString(): string;
    match(node: Node): boolean;
    lookupSort(sorter: LookupSorter, base?: SelectorCore): void;
    accumulateChanges(node: Node, map?: ChangeAccumulator): boolean;
}
export declare namespace Selector {
    class ChildGroup {
        private selectors;
        dynamic: boolean;
        constructor(selectors: SiblingGroup[]);
        match(node: Node): Node;
        mayMatch(node: Node): Node;
        trackChanges(node: Node, map: ChangeAccumulator): void;
    }
    class SiblingGroup {
        private selectors;
        dynamic: boolean;
        constructor(selectors: SimpleSelector[]);
        match(node: Node): Node;
        mayMatch(node: Node): Node;
        trackChanges(node: Node, map: ChangeAccumulator): void;
    }
    interface Bound {
        left: Node;
        right: Node;
    }
}
export declare class RuleSet {
    selectors: SelectorCore[];
    declarations: Declaration[];
    tag: string | number;
    scopedTag: string;
    constructor(selectors: SelectorCore[], declarations: Declaration[]);
    toString(): string;
    lookupSort(sorter: LookupSorter): void;
}
export declare function fromAstNodes(astRules: cssParser.Node[]): RuleSet[];
export declare function createSelector(sel: string): SimpleSelector | SimpleSelectorSequence | Selector;
export declare class SelectorsMap<T extends Node> implements LookupSorter {
    private id;
    private class;
    private type;
    private universal;
    private position;
    constructor(rulesets: RuleSet[]);
    query(node: T): SelectorsMatch<T>;
    sortById(id: string, sel: SelectorCore): void;
    sortByClass(cssClass: string, sel: SelectorCore): void;
    sortByType(cssType: string, sel: SelectorCore): void;
    sortAsUniversal(sel: SelectorCore): void;
    private addToMap;
    private makeDocSelector;
}
interface ChangeAccumulator {
    addAttribute(node: Node, attribute: string): void;
    addPseudoClass(node: Node, pseudoClass: string): void;
}
export declare class SelectorsMatch<T extends Node> implements ChangeAccumulator {
    changeMap: ChangeMap<T>;
    selectors: any;
    addAttribute(node: T, attribute: string): void;
    addPseudoClass(node: T, pseudoClass: string): void;
    properties(node: T): Changes;
}
export declare const CSSHelper: {
    createSelector: typeof createSelector;
    SelectorCore: typeof SelectorCore;
    SimpleSelector: typeof SimpleSelector;
    InvalidSelector: typeof InvalidSelector;
    UniversalSelector: typeof UniversalSelector;
    TypeSelector: typeof TypeSelector;
    ClassSelector: typeof ClassSelector;
    AttributeSelector: typeof AttributeSelector;
    PseudoClassSelector: typeof PseudoClassSelector;
    SimpleSelectorSequence: typeof SimpleSelectorSequence;
    Selector: typeof Selector;
    RuleSet: typeof RuleSet;
    SelectorsMap: typeof SelectorsMap;
    fromAstNodes: typeof fromAstNodes;
    SelectorsMatch: typeof SelectorsMatch;
};
export {};
