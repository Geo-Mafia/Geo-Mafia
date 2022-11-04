import { CssProperty, Property } from '../ui/core/properties';
import type { View } from '../ui/core/view';
import { Style } from '../ui/styling/style';
import { AccessibilityLiveRegion, AccessibilityRole, AccessibilityState, AccessibilityTrait } from './accessibility-types';
export declare const accessibilityEnabledProperty: CssProperty<Style, boolean>;
export declare const accessibilityHiddenProperty: CssProperty<Style, boolean>;
export declare const accessibilityIdentifierProperty: Property<View, string>;
export declare const accessibilityRoleProperty: CssProperty<Style, AccessibilityRole>;
export declare const accessibilityStateProperty: CssProperty<Style, AccessibilityState>;
export declare const accessibilityLabelProperty: Property<View, string>;
export declare const accessibilityValueProperty: Property<View, string>;
export declare const accessibilityHintProperty: Property<View, string>;
export declare const accessibilityIgnoresInvertColorsProperty: Property<View, boolean>;
export declare const accessibilityLiveRegionProperty: CssProperty<Style, AccessibilityLiveRegion>;
export declare const accessibilityTraitsProperty: Property<View, AccessibilityTrait | AccessibilityTrait[]>;
export declare const accessibilityLanguageProperty: CssProperty<Style, string>;
export declare const accessibilityMediaSessionProperty: CssProperty<Style, unknown>;
/**
 * Represents the observable property backing the accessibilityStep property.
 */
export declare const accessibilityStepProperty: CssProperty<Style, number>;
