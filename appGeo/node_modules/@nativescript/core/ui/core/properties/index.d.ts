import { ViewBase } from '../view-base';
import { Style } from '../../styling/style';
/**
 * Value specifying that Property should be set to its initial value.
 */
export declare const unsetValue: any;
export interface PropertyOptions<T, U> {
    readonly name: string;
    readonly defaultValue?: U;
    readonly affectsLayout?: boolean;
    readonly equalityComparer?: (x: U, y: U) => boolean;
    readonly valueChanged?: (target: T, oldValue: U, newValue: U) => void;
    readonly valueConverter?: (value: string) => U;
}
export interface CoerciblePropertyOptions<T, U> extends PropertyOptions<T, U> {
    readonly coerceValue: (t: T, u: U) => U;
}
export interface CssPropertyOptions<T extends Style, U> extends PropertyOptions<T, U> {
    readonly cssName: string;
}
export interface ShorthandPropertyOptions<P> {
    readonly name: string;
    readonly cssName: string;
    readonly converter: (value: string | P) => [CssProperty<any, any> | CssAnimationProperty<any, any>, any][];
    readonly getter: (this: Style) => string | P;
}
export interface CssAnimationPropertyOptions<T, U> {
    readonly name: string;
    readonly cssName?: string;
    readonly defaultValue?: U;
    readonly equalityComparer?: (x: U, y: U) => boolean;
    readonly valueChanged?: (target: T, oldValue: U, newValue: U) => void;
    readonly valueConverter?: (value: string) => U;
}
export declare function _printUnregisteredProperties(): void;
export declare function _getProperties(): Property<any, any>[];
export declare function _getStyleProperties(): CssProperty<any, any>[];
export declare function isCssVariable(property: string): boolean;
export declare function isCssCalcExpression(value: string): boolean;
export declare function isCssVariableExpression(value: string): boolean;
export declare function _evaluateCssVariableExpression(view: ViewBase, cssName: string, value: string): string;
export declare function _evaluateCssCalcExpression(value: string): any;
export declare class Property<T extends ViewBase, U> implements TypedPropertyDescriptor<U>, Property<T, U> {
    private registered;
    readonly name: string;
    readonly key: symbol;
    readonly getDefault: symbol;
    readonly setNative: symbol;
    readonly defaultValueKey: symbol;
    readonly defaultValue: U;
    readonly nativeValueChange: (owner: T, value: U) => void;
    isStyleProperty: boolean;
    get: () => U;
    set: (value: U) => void;
    overrideHandlers: (options: PropertyOptions<T, U>) => void;
    enumerable: boolean;
    configurable: boolean;
    constructor(options: PropertyOptions<T, U>);
    register(cls: {
        prototype: T;
    }): void;
    isSet(instance: T): boolean;
}
export declare class CoercibleProperty<T extends ViewBase, U> extends Property<T, U> implements CoercibleProperty<T, U> {
    readonly coerce: (target: T) => void;
    constructor(options: CoerciblePropertyOptions<T, U>);
}
export declare class InheritedProperty<T extends ViewBase, U> extends Property<T, U> implements InheritedProperty<T, U> {
    readonly sourceKey: symbol;
    readonly setInheritedValue: (value: U) => void;
    constructor(options: PropertyOptions<T, U>);
}
export declare class CssProperty<T extends Style, U> implements CssProperty<T, U> {
    private registered;
    readonly name: string;
    readonly cssName: string;
    readonly cssLocalName: string;
    protected readonly cssValueDescriptor: PropertyDescriptor;
    protected readonly localValueDescriptor: PropertyDescriptor;
    isStyleProperty: boolean;
    readonly key: symbol;
    readonly getDefault: symbol;
    readonly setNative: symbol;
    readonly sourceKey: symbol;
    readonly defaultValueKey: symbol;
    readonly defaultValue: U;
    overrideHandlers: (options: CssPropertyOptions<T, U>) => void;
    constructor(options: CssPropertyOptions<T, U>);
    register(cls: {
        prototype: T;
    }): void;
    isSet(instance: T): boolean;
}
export declare class CssAnimationProperty<T extends Style, U> implements CssAnimationProperty<T, U> {
    readonly name: string;
    readonly cssName: string;
    readonly cssLocalName: string;
    readonly getDefault: symbol;
    readonly setNative: symbol;
    readonly register: (cls: {
        prototype: any;
    }) => void;
    readonly keyframe: string;
    readonly defaultValueKey: symbol;
    readonly key: symbol;
    private readonly source;
    readonly defaultValue: U;
    isStyleProperty: boolean;
    private static properties;
    _valueConverter?: (value: string) => any;
    constructor(options: CssAnimationPropertyOptions<T, U>);
    _initDefaultNativeValue(target: T): void;
    static _getByCssName(name: string): CssAnimationProperty<any, any>;
    static _getPropertyNames(): string[];
    isSet(instance: T): boolean;
}
export declare class InheritedCssProperty<T extends Style, U> extends CssProperty<T, U> implements InheritedCssProperty<T, U> {
    setInheritedValue: (value: U) => void;
    overrideHandlers: (options: CssPropertyOptions<T, U>) => void;
    constructor(options: CssPropertyOptions<T, U>);
}
export declare class ShorthandProperty<T extends Style, P> implements ShorthandProperty<T, P> {
    private registered;
    readonly key: symbol;
    readonly name: string;
    readonly cssName: string;
    readonly cssLocalName: string;
    protected readonly cssValueDescriptor: PropertyDescriptor;
    protected readonly localValueDescriptor: PropertyDescriptor;
    protected readonly propertyBagDescriptor: PropertyDescriptor;
    readonly sourceKey: symbol;
    constructor(options: ShorthandPropertyOptions<P>);
    register(cls: typeof Style): void;
}
export declare const initNativeView: any;
export declare function applyPendingNativeSetters(view: ViewBase): void;
export declare function applyAllNativeSetters(view: ViewBase): void;
export declare function resetNativeView(view: ViewBase): void;
export declare function clearInheritedProperties(view: ViewBase): void;
export declare function resetCSSProperties(style: Style): void;
export declare function propagateInheritableProperties(view: ViewBase, child: ViewBase): void;
export declare function propagateInheritableCssProperties(parentStyle: Style, childStyle: Style): void;
export declare function makeValidator<T>(...values: T[]): (value: any) => value is T;
export declare function makeParser<T>(isValid: (value: any) => boolean, allowNumbers?: boolean): (value: any) => T;
export declare function getSetProperties(view: ViewBase): [string, any][];
export declare function getComputedCssValues(view: ViewBase): [string, any][];
