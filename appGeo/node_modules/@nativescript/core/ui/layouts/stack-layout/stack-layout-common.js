import { LayoutBase } from '../layout-base';
import { CSSType } from '../../core/view';
import { Property, makeParser, makeValidator } from '../../core/properties';
let StackLayoutBase = class StackLayoutBase extends LayoutBase {
};
StackLayoutBase = __decorate([
    CSSType('StackLayout')
], StackLayoutBase);
export { StackLayoutBase };
StackLayoutBase.prototype.recycleNativeView = 'auto';
const converter = makeParser(makeValidator('horizontal', 'vertical'));
export const orientationProperty = new Property({
    name: 'orientation',
    defaultValue: 'vertical',
    affectsLayout: global.isIOS,
    valueConverter: converter,
});
orientationProperty.register(StackLayoutBase);
//# sourceMappingURL=stack-layout-common.js.map