import { Progress as ProgressDefinition } from '.';
import { View } from '../core/view';
import { Property, CoercibleProperty } from '../core/properties';
export declare class ProgressBase extends View implements ProgressDefinition {
    value: number;
    maxValue: number;
}
/**
 * Represents the observable property backing the value property of each Progress instance.
 */
export declare const valueProperty: CoercibleProperty<ProgressBase, number>;
/**
 * Represents the observable property backing the maxValue property of each Progress instance.
 */
export declare const maxValueProperty: Property<ProgressBase, number>;
