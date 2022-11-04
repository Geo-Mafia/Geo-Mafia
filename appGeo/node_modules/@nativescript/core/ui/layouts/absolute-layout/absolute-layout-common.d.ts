import { AbsoluteLayout as AbsoluteLayoutDefinition } from '.';
import { LayoutBase } from '../layout-base';
import { CoreTypes } from '../../../core-types';
import { View } from '../../core/view';
import { Property } from '../../core/properties';
export * from '../layout-base';
export declare class AbsoluteLayoutBase extends LayoutBase implements AbsoluteLayoutDefinition {
    static getLeft(element: View): CoreTypes.LengthType;
    static setLeft(element: View, value: CoreTypes.LengthType): void;
    static getTop(element: View): CoreTypes.LengthType;
    static setTop(element: View, value: CoreTypes.LengthType): void;
    onLeftChanged(view: View, oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
    onTopChanged(view: View, oldValue: CoreTypes.LengthType, newValue: CoreTypes.LengthType): void;
}
export declare const leftProperty: Property<View, CoreTypes.LengthType>;
export declare const topProperty: Property<View, CoreTypes.LengthType>;
