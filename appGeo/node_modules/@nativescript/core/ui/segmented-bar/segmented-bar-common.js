import { View, CSSType } from '../core/view';
import { ViewBase } from '../core/view-base';
import { Property, CoercibleProperty, InheritedCssProperty } from '../core/properties';
import { Color } from '../../color';
import { Style } from '../styling/style';
let SegmentedBarItemBase = class SegmentedBarItemBase extends ViewBase {
    constructor() {
        super(...arguments);
        this._title = '';
    }
    get title() {
        return this._title;
    }
    set title(value) {
        const strValue = value !== null && value !== undefined ? value.toString() : '';
        if (this._title !== strValue) {
            this._title = strValue;
            this._update();
        }
    }
};
SegmentedBarItemBase = __decorate([
    CSSType('SegmentedBarItem')
], SegmentedBarItemBase);
export { SegmentedBarItemBase };
let SegmentedBarBase = class SegmentedBarBase extends View {
    get selectedBackgroundColor() {
        return this.style.selectedBackgroundColor;
    }
    set selectedBackgroundColor(value) {
        this.style.selectedBackgroundColor = value;
    }
    _addArrayFromBuilder(name, value) {
        if (name === 'items') {
            this.items = value;
        }
    }
    _addChildFromBuilder(name, value) {
        if (name === 'SegmentedBarItem') {
            const item = value;
            let items = this.items;
            if (!items) {
                items = new Array();
                items.push(item);
                this.items = items;
            }
            else {
                items.push(item);
                this._addView(item);
            }
            if (this.nativeViewProtected) {
                this[itemsProperty.setNative](items);
            }
        }
    }
    onItemsChanged(oldItems, newItems) {
        if (oldItems) {
            for (let i = 0, count = oldItems.length; i < count; i++) {
                this._removeView(oldItems[i]);
            }
        }
        if (newItems) {
            for (let i = 0, count = newItems.length; i < count; i++) {
                this._addView(newItems[i]);
            }
        }
    }
    // TODO: Make _addView to keep its children so this method is not needed!
    eachChild(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item);
            });
        }
    }
};
SegmentedBarBase.selectedIndexChangedEvent = 'selectedIndexChanged';
SegmentedBarBase = __decorate([
    CSSType('SegmentedBar')
], SegmentedBarBase);
export { SegmentedBarBase };
SegmentedBarBase.prototype.recycleNativeView = 'auto';
/**
 * Gets or sets the selected index dependency property of the SegmentedBar.
 */
export const selectedIndexProperty = new CoercibleProperty({
    name: 'selectedIndex',
    defaultValue: -1,
    valueChanged: (target, oldValue, newValue) => {
        target.notify({
            eventName: SegmentedBarBase.selectedIndexChangedEvent,
            object: target,
            oldIndex: oldValue,
            newIndex: newValue,
        });
    },
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
        return value;
    },
    valueConverter: (v) => parseInt(v),
});
selectedIndexProperty.register(SegmentedBarBase);
export const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        target.onItemsChanged(oldValue, newValue);
    },
});
itemsProperty.register(SegmentedBarBase);
export const selectedBackgroundColorProperty = new InheritedCssProperty({
    name: 'selectedBackgroundColor',
    cssName: 'selected-background-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
selectedBackgroundColorProperty.register(Style);
//# sourceMappingURL=segmented-bar-common.js.map