import { Color } from '../../color';
import { View, CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { Property } from '../core/properties';
let SwitchBase = class SwitchBase extends View {
    _onCheckedPropertyChanged(newValue) {
        if (newValue) {
            this.addPseudoClass('checked');
        }
        else {
            this.deletePseudoClass('checked');
        }
    }
};
SwitchBase.checkedChangeEvent = 'checkedChange';
SwitchBase = __decorate([
    CSSType('Switch')
], SwitchBase);
export { SwitchBase };
SwitchBase.prototype.recycleNativeView = 'auto';
function onCheckedPropertyChanged(switchBase, oldValue, newValue) {
    switchBase._onCheckedPropertyChanged(newValue);
}
export const checkedProperty = new Property({
    name: 'checked',
    defaultValue: false,
    valueConverter: booleanConverter,
    valueChanged: onCheckedPropertyChanged,
});
checkedProperty.register(SwitchBase);
export const offBackgroundColorProperty = new Property({
    name: 'offBackgroundColor',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
offBackgroundColorProperty.register(SwitchBase);
//# sourceMappingURL=switch-common.js.map