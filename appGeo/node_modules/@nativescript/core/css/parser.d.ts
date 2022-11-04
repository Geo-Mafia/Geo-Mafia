import { Color } from '../color';
export declare type Parsed<V> = {
    start: number;
    end: number;
    value: V;
};
export declare type URL = string;
export declare type Angle = number;
export interface Unit<T> {
    value: number;
    unit: string;
}
export declare type Length = Unit<'px' | 'dip'>;
export declare type Percentage = Unit<'%'>;
export declare type LengthPercentage = Length | Percentage;
export declare type Keyword = string;
export interface ColorStop {
    color: Color;
    offset?: LengthPercentage;
}
export interface LinearGradient {
    angle: number;
    colors: ColorStop[];
}
export interface Background {
    readonly color?: number | Color;
    readonly image?: URL | LinearGradient;
    readonly repeat?: BackgroundRepeat;
    readonly position?: BackgroundPosition;
    readonly size?: BackgroundSize;
}
export declare type BackgroundRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
export declare type BackgroundSize = 'auto' | 'cover' | 'contain' | {
    x: LengthPercentage;
    y: 'auto' | LengthPercentage;
};
export declare type HorizontalAlign = 'left' | 'center' | 'right';
export declare type VerticalAlign = 'top' | 'center' | 'bottom';
export interface HorizontalAlignWithOffset {
    readonly align: 'left' | 'right';
    readonly offset: LengthPercentage;
}
export interface VerticalAlignWithOffset {
    readonly align: 'top' | 'bottom';
    readonly offset: LengthPercentage;
}
export interface BackgroundPosition {
    readonly x: HorizontalAlign | HorizontalAlignWithOffset;
    readonly y: VerticalAlign | VerticalAlignWithOffset;
    text?: string;
}
export declare function parseURL(text: string, start?: number): Parsed<URL>;
export declare function parseHexColor(text: string, start?: number): Parsed<Color>;
export declare function parseCssColor(text: string, start?: number): Parsed<Color>;
export declare function convertHSLToRGBColor(hue: number, saturation: number, lightness: number): {
    r: number;
    g: number;
    b: number;
};
export declare function parseColorKeyword(value: any, start: number, keyword?: Parsed<string>): Parsed<Color>;
export declare function parseColor(value: string, start?: number, keyword?: Parsed<string>): Parsed<Color>;
export declare function parseRepeat(value: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundRepeat>;
export declare function parseUnit(text: string, start?: number): Parsed<Unit<string>>;
export declare function parsePercentageOrLength(text: string, start?: number): Parsed<LengthPercentage>;
export declare function parseAngle(value: string, start?: number): Parsed<Angle>;
export declare function parseBackgroundSize(value: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundSize>;
export declare function parseBackgroundPosition(text: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundPosition>;
export declare function parseColorStop(text: string, start?: number): Parsed<ColorStop>;
export declare function parseLinearGradient(text: string, start?: number): Parsed<LinearGradient>;
export declare function parseBackground(text: string, start?: number): Parsed<Background>;
export declare type Combinator = '+' | '~' | '>' | ' ';
export interface UniversalSelector {
    type: '*';
}
export interface TypeSelector {
    type: '';
    identifier: string;
}
export interface ClassSelector {
    type: '.';
    identifier: string;
}
export interface IdSelector {
    type: '#';
    identifier: string;
}
export interface PseudoClassSelector {
    type: ':';
    identifier: string;
}
export declare type AttributeSelectorTest = '=' | '^=' | '$=' | '*=' | '~=' | '|=';
export interface AttributeSelector {
    type: '[]';
    property: string;
    test?: AttributeSelectorTest;
    value?: string;
}
export declare type SimpleSelector = UniversalSelector | TypeSelector | ClassSelector | IdSelector | PseudoClassSelector | AttributeSelector;
export declare type SimpleSelectorSequence = SimpleSelector[];
export declare type SelectorCombinatorPair = [SimpleSelectorSequence, Combinator];
export declare type Selector = SelectorCombinatorPair[];
export declare function parseUniversalSelector(text: string, start?: number): Parsed<UniversalSelector>;
export declare function parseSimpleIdentifierSelector(text: string, start?: number): Parsed<TypeSelector | ClassSelector | IdSelector | PseudoClassSelector>;
export declare function parseAttributeSelector(text: string, start: number): Parsed<AttributeSelector>;
export declare function parseSimpleSelector(text: string, start?: number): Parsed<SimpleSelector>;
export declare function parseSimpleSelectorSequence(text: string, start: number): Parsed<SimpleSelector[]>;
export declare function parseCombinator(text: string, start?: number): Parsed<Combinator>;
export declare function parseSelector(text: string, start?: number): Parsed<Selector>;
