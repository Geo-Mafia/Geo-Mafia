import { WrapLayout as WrapLayoutDefinition } from '.';
import { LayoutBase } from '../layout-base';
import { Property } from '../../core/properties';
import { CoreTypes } from '../../../core-types';
export * from '../layout-base';
export declare class WrapLayoutBase extends LayoutBase implements WrapLayoutDefinition {
    orientation: CoreTypes.OrientationType;
    itemWidth: CoreTypes.LengthType;
    itemHeight: CoreTypes.LengthType;
    effectiveItemWidth: number;
    effectiveItemHeight: number;
}
export declare const itemWidthProperty: Property<WrapLayoutBase, CoreTypes.LengthType>;
export declare const itemHeightProperty: Property<WrapLayoutBase, CoreTypes.LengthType>;
export declare const orientationProperty: Property<WrapLayoutBase, CoreTypes.OrientationType>;
