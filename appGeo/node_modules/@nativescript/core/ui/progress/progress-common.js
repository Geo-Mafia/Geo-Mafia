import { View, CSSType } from '../core/view';
import { Property, CoercibleProperty } from '../core/properties';
let ProgressBase = class ProgressBase extends View {
};
ProgressBase = __decorate([
    CSSType('Progress')
], ProgressBase);
export { ProgressBase };
ProgressBase.prototype.recycleNativeView = 'auto';
/**
 * Represents the observable property backing the value property of each Progress instance.
 */
export const valueProperty = new CoercibleProperty({
    name: 'value',
    defaultValue: 0,
    coerceValue: (t, v) => {
        return v < 0 ? 0 : Math.min(v, t.maxValue);
    },
    valueConverter: (v) => parseInt(v),
});
valueProperty.register(ProgressBase);
/**
 * Represents the observable property backing the maxValue property of each Progress instance.
 */
export const maxValueProperty = new Property({
    name: 'maxValue',
    defaultValue: 100,
    valueChanged: (target, oldValue, newValue) => {
        valueProperty.coerce(target);
    },
    valueConverter: (v) => parseInt(v),
});
maxValueProperty.register(ProgressBase);
//# sourceMappingURL=progress-common.js.map