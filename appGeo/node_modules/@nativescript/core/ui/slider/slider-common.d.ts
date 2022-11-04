import { Slider as SliderDefinition } from '.';
import { AccessibilityRole } from '../../accessibility';
import { CoercibleProperty, Property } from '../core/properties';
import { View } from '../core/view';
export declare class SliderBase extends View implements SliderDefinition {
    static readonly accessibilityIncrementEvent = "accessibilityIncrement";
    static readonly accessibilityDecrementEvent = "accessibilityDecrement";
    value: number;
    minValue: number;
    maxValue: number;
    get accessibilityStep(): number;
    set accessibilityStep(value: number);
    accessible: boolean;
    accessibilityRole: AccessibilityRole;
}
/**
 * Represents the observable property backing the value property of each Slider instance.
 */
export declare const valueProperty: CoercibleProperty<SliderBase, number>;
/**
 * Represents the observable property backing the minValue property of each Slider instance.
 */
export declare const minValueProperty: Property<SliderBase, number>;
/**
 * Represents the observable property backing the maxValue property of each Slider instance.
 */
export declare const maxValueProperty: CoercibleProperty<SliderBase, number>;
