import { LayoutBase } from '../layout-base';
import { CSSType } from '../../core/view';
import { Property, makeValidator, makeParser } from '../../core/properties';
import { Length } from '../../styling/style-properties';
import { CoreTypes } from '../../../core-types';
export * from '../layout-base';
let WrapLayoutBase = class WrapLayoutBase extends LayoutBase {
};
WrapLayoutBase = __decorate([
    CSSType('WrapLayout')
], WrapLayoutBase);
export { WrapLayoutBase };
WrapLayoutBase.prototype.recycleNativeView = 'auto';
export const itemWidthProperty = new Property({
    name: 'itemWidth',
    defaultValue: 'auto',
    affectsLayout: global.isIOS,
    valueConverter: (v) => Length.parse(v),
    valueChanged: (target, oldValue, newValue) => (target.effectiveItemWidth = Length.toDevicePixels(newValue, -1)),
});
itemWidthProperty.register(WrapLayoutBase);
export const itemHeightProperty = new Property({
    name: 'itemHeight',
    defaultValue: 'auto',
    affectsLayout: global.isIOS,
    valueConverter: (v) => Length.parse(v),
    valueChanged: (target, oldValue, newValue) => (target.effectiveItemHeight = Length.toDevicePixels(newValue, -1)),
});
itemHeightProperty.register(WrapLayoutBase);
const converter = makeParser(makeValidator(CoreTypes.Orientation.horizontal, CoreTypes.Orientation.vertical));
export const orientationProperty = new Property({
    name: 'orientation',
    defaultValue: CoreTypes.Orientation.horizontal,
    affectsLayout: global.isIOS,
    valueConverter: converter,
});
orientationProperty.register(WrapLayoutBase);
//# sourceMappingURL=wrap-layout-common.js.map