import { ActivityIndicator as ActivityIndicatorDefinition } from '.';
import { View } from '../core/view';
import { Property } from '../core/properties';
export declare class ActivityIndicatorBase extends View implements ActivityIndicatorDefinition {
    busy: boolean;
}
export declare const busyProperty: Property<ActivityIndicatorBase, boolean>;
