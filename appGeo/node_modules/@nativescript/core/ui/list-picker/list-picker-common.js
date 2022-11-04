import { View, CSSType } from '../core/view';
import { Property, CoercibleProperty } from '../core/properties';
let ListPickerBase = class ListPickerBase extends View {
    _getItemAsString(index) {
        const items = this.items;
        if (!items) {
            return ' ';
        }
        const item = this.isItemsSource ? this.items.getItem(index) : this.items[index];
        return item === undefined || item === null ? index + '' : this.parseItem(item);
    }
    parseItem(item) {
        return this.textField ? item[this.textField] + '' : item + '';
    }
    updateSelectedValue(index) {
        let newVal = null;
        if (index >= 0) {
            const item = this.items[index];
            newVal = this.valueField ? item[this.valueField] : item;
        }
        if (this.selectedValue !== newVal) {
            this.set('selectedValue', newVal);
        }
    }
};
ListPickerBase = __decorate([
    CSSType('ListPicker')
], ListPickerBase);
export { ListPickerBase };
ListPickerBase.prototype.recycleNativeView = 'auto';
export const selectedIndexProperty = new CoercibleProperty({
    name: 'selectedIndex',
    defaultValue: -1,
    valueConverter: (v) => parseInt(v),
    coerceValue: (target, value) => {
        const items = target.items;
        if (items) {
            const max = items.length - 1;
            if (value < 0) {
                value = 0;
            }
            if (value > max) {
                value = max;
            }
        }
        else {
            value = -1;
        }
        target.updateSelectedValue(value);
        return value;
    },
});
selectedIndexProperty.register(ListPickerBase);
export const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        const getItem = newValue && newValue.getItem;
        target.isItemsSource = typeof getItem === 'function';
    },
});
itemsProperty.register(ListPickerBase);
export const textFieldProperty = new Property({
    name: 'textField',
    defaultValue: '',
});
textFieldProperty.register(ListPickerBase);
export const valueFieldProperty = new Property({
    name: 'valueField',
    defaultValue: '',
});
valueFieldProperty.register(ListPickerBase);
export const selectedValueProperty = new Property({
    name: 'selectedValue',
    defaultValue: null,
});
selectedValueProperty.register(ListPickerBase);
//# sourceMappingURL=list-picker-common.js.map