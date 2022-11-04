import { CssProperty, InheritedCssProperty, Property } from '../ui/core/properties';
import { booleanConverter } from '../ui/core/view-base';
import { Style } from '../ui/styling/style';
import { AccessibilityLiveRegion, AccessibilityRole, AccessibilityState } from './accessibility-types';
function makePropertyEnumConverter(enumValues) {
    return (value) => {
        if (!value || typeof value !== 'string') {
            return null;
        }
        for (const [enumKey, enumValue] of Object.entries(enumValues)) {
            if (typeof enumKey !== 'string') {
                continue;
            }
            if (enumKey === value || `${enumValue}`.toLowerCase() === `${value}`.toLowerCase()) {
                return enumValue;
            }
        }
        return null;
    };
}
export const accessibilityEnabledProperty = new CssProperty({
    name: 'accessible',
    cssName: 'a11y-enabled',
    valueConverter: booleanConverter,
});
accessibilityEnabledProperty.register(Style);
const accessibilityHiddenPropertyName = 'accessibilityHidden';
const accessibilityHiddenCssName = 'a11y-hidden';
export const accessibilityHiddenProperty = global.isIOS
    ? new InheritedCssProperty({
        name: accessibilityHiddenPropertyName,
        cssName: accessibilityHiddenCssName,
        valueConverter: booleanConverter,
    })
    : new CssProperty({
        name: accessibilityHiddenPropertyName,
        cssName: accessibilityHiddenCssName,
        valueConverter: booleanConverter,
    });
accessibilityHiddenProperty.register(Style);
export const accessibilityIdentifierProperty = new Property({
    name: 'accessibilityIdentifier',
});
export const accessibilityRoleProperty = new CssProperty({
    name: 'accessibilityRole',
    cssName: 'a11y-role',
    valueConverter: makePropertyEnumConverter(AccessibilityRole),
});
accessibilityRoleProperty.register(Style);
export const accessibilityStateProperty = new CssProperty({
    name: 'accessibilityState',
    cssName: 'a11y-state',
    valueConverter: makePropertyEnumConverter(AccessibilityState),
});
accessibilityStateProperty.register(Style);
export const accessibilityLabelProperty = new Property({
    name: 'accessibilityLabel',
});
export const accessibilityValueProperty = new Property({
    name: 'accessibilityValue',
});
export const accessibilityHintProperty = new Property({
    name: 'accessibilityHint',
});
export const accessibilityIgnoresInvertColorsProperty = new Property({
    name: 'accessibilityIgnoresInvertColors',
    valueConverter: booleanConverter,
});
export const accessibilityLiveRegionProperty = new CssProperty({
    name: 'accessibilityLiveRegion',
    cssName: 'a11y-live-region',
    defaultValue: AccessibilityLiveRegion.None,
    valueConverter: makePropertyEnumConverter(AccessibilityLiveRegion),
});
accessibilityLiveRegionProperty.register(Style);
export const accessibilityTraitsProperty = new Property({
    name: 'accessibilityTraits',
});
export const accessibilityLanguageProperty = new CssProperty({
    name: 'accessibilityLanguage',
    cssName: 'a11y-lang',
});
accessibilityLanguageProperty.register(Style);
export const accessibilityMediaSessionProperty = new CssProperty({
    name: 'accessibilityMediaSession',
    cssName: 'a11y-media-session',
});
accessibilityMediaSessionProperty.register(Style);
/**
 * Represents the observable property backing the accessibilityStep property.
 */
export const accessibilityStepProperty = new CssProperty({
    name: 'accessibilityStep',
    cssName: 'a11y-step',
    defaultValue: 10,
    valueConverter: (v) => {
        const step = parseFloat(v);
        if (isNaN(step) || step <= 0) {
            return 10;
        }
        return step;
    },
});
accessibilityStepProperty.register(Style);
//# sourceMappingURL=accessibility-properties.js.map