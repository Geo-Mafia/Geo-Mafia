import { View, CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { Property } from '../core/properties';
let ActivityIndicatorBase = class ActivityIndicatorBase extends View {
};
ActivityIndicatorBase = __decorate([
    CSSType('ActivityIndicator')
], ActivityIndicatorBase);
export { ActivityIndicatorBase };
ActivityIndicatorBase.prototype.recycleNativeView = 'auto';
export const busyProperty = new Property({
    name: 'busy',
    defaultValue: false,
    valueConverter: booleanConverter,
});
busyProperty.register(ActivityIndicatorBase);
//# sourceMappingURL=activity-indicator-common.js.map