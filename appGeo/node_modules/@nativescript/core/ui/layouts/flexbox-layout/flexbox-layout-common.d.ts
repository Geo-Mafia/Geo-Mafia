import { LayoutBase } from '../layout-base';
import { View } from '../../core/view';
import { CssProperty } from '../../core/properties';
import { Style } from '../../styling/style';
export declare type Basis = 'auto' | number;
export declare const ORDER_DEFAULT = 1;
export declare const FLEX_GROW_DEFAULT = 0;
export declare const FLEX_SHRINK_DEFAULT = 1;
export declare type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export declare namespace FlexDirection {
    const ROW = "row";
    const ROW_REVERSE = "row-reverse";
    const COLUMN = "column";
    const COLUMN_REVERSE = "column-reverse";
    const isValid: (value: any) => value is FlexDirection;
    const parse: (value: any) => FlexDirection;
}
export declare type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export declare namespace FlexWrap {
    const NOWRAP = "nowrap";
    const WRAP = "wrap";
    const WRAP_REVERSE = "wrap-reverse";
    const isValid: (value: any) => value is FlexWrap;
    const parse: (value: any) => FlexWrap;
}
export declare type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
export declare namespace JustifyContent {
    const FLEX_START: "flex-start";
    const FLEX_END: "flex-end";
    const CENTER: "center";
    const SPACE_BETWEEN = "space-between";
    const SPACE_AROUND = "space-around";
    const isValid: (value: any) => value is JustifyContent;
    const parse: (value: any) => JustifyContent;
}
export declare type FlexBasisPercent = number;
export declare namespace FlexBasisPercent {
    const DEFAULT = -1;
}
export declare type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
export declare namespace AlignItems {
    const FLEX_START = "flex-start";
    const FLEX_END = "flex-end";
    const CENTER = "center";
    const BASELINE = "baseline";
    const STRETCH = "stretch";
    const isValid: (value: any) => value is AlignItems;
    const parse: (value: any) => AlignItems;
}
export declare type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
export declare namespace AlignContent {
    const FLEX_START = "flex-start";
    const FLEX_END = "flex-end";
    const CENTER = "center";
    const SPACE_BETWEEN = "space-between";
    const SPACE_AROUND = "space-around";
    const STRETCH = "stretch";
    const isValid: (value: any) => value is AlignContent;
    const parse: (value: any) => AlignContent;
}
export declare type Order = number;
export declare namespace Order {
    function isValid(value: any): boolean;
    const parse: typeof parseInt;
}
export declare type FlexGrow = number;
export declare namespace FlexGrow {
    function isValid(value: any): boolean;
    const parse: typeof parseFloat;
}
export declare type FlexShrink = number;
export declare namespace FlexShrink {
    function isValid(value: any): boolean;
    const parse: typeof parseFloat;
}
export declare type FlexWrapBefore = boolean;
export declare namespace FlexWrapBefore {
    function isValid(value: any): boolean;
    function parse(value: string): FlexWrapBefore;
}
export declare type AlignSelf = 'auto' | AlignItems;
export declare namespace AlignSelf {
    const AUTO = "auto";
    const FLEX_START = "flex-start";
    const FLEX_END = "flex-end";
    const CENTER = "center";
    const BASELINE = "baseline";
    const STRETCH = "stretch";
    const isValid: (value: any) => value is AlignSelf;
    const parse: (value: any) => AlignSelf;
}
/**
 * A common base class for all cross platform flexbox layout implementations.
 */
export declare abstract class FlexboxLayoutBase extends LayoutBase {
    get flexDirection(): FlexDirection;
    set flexDirection(value: FlexDirection);
    get flexWrap(): FlexWrap;
    set flexWrap(value: FlexWrap);
    get justifyContent(): JustifyContent;
    set justifyContent(value: JustifyContent);
    get alignItems(): AlignItems;
    set alignItems(value: AlignItems);
    get alignContent(): AlignContent;
    set alignContent(value: AlignContent);
    static setOrder(view: View, order: number): void;
    static getOrder(view: View): number;
    static setFlexGrow(view: View, grow: number): void;
    static getFlexGrow(view: View): number;
    static setFlexShrink(view: View, shrink: number): void;
    static getFlexShrink(view: View): number;
    static setAlignSelf(view: View, align: AlignSelf): void;
    static getAlignSelf(view: View): AlignSelf;
    static setFlexWrapBefore(view: View, wrap: boolean): void;
    static getFlexWrapBefore(view: View): boolean;
}
export declare const flexDirectionProperty: CssProperty<Style, FlexDirection>;
export declare const flexWrapProperty: CssProperty<Style, FlexWrap>;
export declare const justifyContentProperty: CssProperty<Style, JustifyContent>;
export declare const alignItemsProperty: CssProperty<Style, AlignItems>;
export declare const alignContentProperty: CssProperty<Style, AlignContent>;
export declare const orderProperty: CssProperty<Style, number>;
export declare const flexGrowProperty: CssProperty<Style, number>;
export declare const flexShrinkProperty: CssProperty<Style, number>;
export declare const flexWrapBeforeProperty: CssProperty<Style, boolean>;
export declare const alignSelfProperty: CssProperty<Style, AlignSelf>;
