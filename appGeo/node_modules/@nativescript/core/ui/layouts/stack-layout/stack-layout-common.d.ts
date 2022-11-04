import { StackLayout as StackLayoutDefinition } from '.';
import { LayoutBase } from '../layout-base';
import { Property } from '../../core/properties';
import { CoreTypes } from '../../../core-types';
export declare class StackLayoutBase extends LayoutBase implements StackLayoutDefinition {
    orientation: CoreTypes.OrientationType;
}
export declare const orientationProperty: Property<StackLayoutBase, CoreTypes.OrientationType>;
