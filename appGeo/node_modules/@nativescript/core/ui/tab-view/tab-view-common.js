var TabViewBase_1;
import { View, CSSType } from '../core/view';
import { ViewBase, booleanConverter } from '../core/view-base';
import { Style } from '../styling/style';
import { Color } from '../../color';
import { Property, CssProperty, CoercibleProperty } from '../core/properties';
import { Trace } from '../../trace';
export const traceCategory = 'TabView';
let TabViewItemBase = class TabViewItemBase extends ViewBase {
    constructor() {
        super(...arguments);
        this._title = '';
    }
    get textTransform() {
        return this.style.textTransform;
    }
    set textTransform(value) {
        this.style.textTransform = value;
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof View) {
            this.view = value;
        }
    }
    get title() {
        return this._title;
    }
    set title(value) {
        if (this._title !== value) {
            this._title = value;
            this._update();
        }
    }
    get view() {
        return this._view;
    }
    set view(value) {
        if (this._view !== value) {
            if (this._view) {
                throw new Error('Changing the view of an already loaded TabViewItem is not currently supported.');
            }
            this._view = value;
            this._addView(value);
        }
    }
    get iconSource() {
        return this._iconSource;
    }
    set iconSource(value) {
        if (this._iconSource !== value) {
            this._iconSource = value;
            this._update();
        }
    }
    eachChild(callback) {
        const view = this._view;
        if (view) {
            callback(view);
        }
    }
    loadView(view) {
        const tabView = this.parent;
        if (tabView && tabView.items) {
            // Don't load items until their fragments are instantiated.
            if (this.canBeLoaded) {
                super.loadView(view);
            }
        }
    }
};
TabViewItemBase = __decorate([
    CSSType('TabViewItem')
], TabViewItemBase);
export { TabViewItemBase };
let TabViewBase = TabViewBase_1 = class TabViewBase extends View {
    get androidSelectedTabHighlightColor() {
        return this.style.androidSelectedTabHighlightColor;
    }
    set androidSelectedTabHighlightColor(value) {
        this.style.androidSelectedTabHighlightColor = value;
    }
    get tabTextFontSize() {
        return this.style.tabTextFontSize;
    }
    set tabTextFontSize(value) {
        this.style.tabTextFontSize = value;
    }
    get tabTextColor() {
        return this.style.tabTextColor;
    }
    set tabTextColor(value) {
        this.style.tabTextColor = value;
    }
    get tabBackgroundColor() {
        return this.style.tabBackgroundColor;
    }
    set tabBackgroundColor(value) {
        this.style.tabBackgroundColor = value;
    }
    get selectedTabTextColor() {
        return this.style.selectedTabTextColor;
    }
    set selectedTabTextColor(value) {
        this.style.selectedTabTextColor = value;
    }
    _addArrayFromBuilder(name, value) {
        if (name === 'items') {
            this.items = value;
        }
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof TabViewItemBase) {
            if (!this.items) {
                this.items = new Array();
            }
            this.items.push(value);
            this._addView(value);
            selectedIndexProperty.coerce(this);
        }
    }
    get _selectedView() {
        const selectedIndex = this.selectedIndex;
        return selectedIndex > -1 ? this.items[selectedIndex].view : null;
    }
    get _childrenCount() {
        const items = this.items;
        return items ? items.length : 0;
    }
    eachChild(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item);
            });
        }
    }
    eachChildView(callback) {
        const items = this.items;
        if (items) {
            items.forEach((item, i) => {
                callback(item.view);
            });
        }
    }
    onItemsChanged(oldItems, newItems) {
        if (oldItems) {
            oldItems.forEach((item) => this._removeView(item));
        }
        if (newItems) {
            newItems.forEach((item) => {
                if (!item.view) {
                    throw new Error(`TabViewItem must have a view.`);
                }
                this._addView(item);
            });
        }
    }
    onSelectedIndexChanged(oldIndex, newIndex) {
        // to be overridden in platform specific files
        this.notify({
            eventName: TabViewBase_1.selectedIndexChangedEvent,
            object: this,
            oldIndex,
            newIndex,
        });
    }
};
TabViewBase.selectedIndexChangedEvent = 'selectedIndexChanged';
TabViewBase = TabViewBase_1 = __decorate([
    CSSType('TabView')
], TabViewBase);
export { TabViewBase };
export function traceMissingIcon(icon) {
    Trace.write('Could not load tab bar icon: ' + icon, Trace.categories.Error, Trace.messageType.error);
}
export const selectedIndexProperty = new CoercibleProperty({
    name: 'selectedIndex',
    defaultValue: -1,
    affectsLayout: global.isIOS,
    valueChanged: (target, oldValue, newValue) => {
        target.onSelectedIndexChanged(oldValue, newValue);
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
selectedIndexProperty.register(TabViewBase);
export const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        target.onItemsChanged(oldValue, newValue);
    },
});
itemsProperty.register(TabViewBase);
export const iosIconRenderingModeProperty = new Property({ name: 'iosIconRenderingMode', defaultValue: 'automatic' });
iosIconRenderingModeProperty.register(TabViewBase);
export const androidIconRenderingModeProperty = new Property({ name: 'androidIconRenderingMode', defaultValue: 'alwaysOriginal' });
androidIconRenderingModeProperty.register(TabViewBase);
export const androidOffscreenTabLimitProperty = new Property({
    name: 'androidOffscreenTabLimit',
    defaultValue: 1,
    affectsLayout: global.isIOS,
    valueConverter: (v) => parseInt(v),
});
androidOffscreenTabLimitProperty.register(TabViewBase);
export const androidTabsPositionProperty = new Property({ name: 'androidTabsPosition', defaultValue: 'top' });
androidTabsPositionProperty.register(TabViewBase);
export const androidSwipeEnabledProperty = new Property({
    name: 'androidSwipeEnabled',
    defaultValue: true,
    valueConverter: booleanConverter,
});
androidSwipeEnabledProperty.register(TabViewBase);
export const tabTextFontSizeProperty = new CssProperty({
    name: 'tabTextFontSize',
    cssName: 'tab-text-font-size',
    valueConverter: (v) => parseFloat(v),
});
tabTextFontSizeProperty.register(Style);
export const tabTextColorProperty = new CssProperty({
    name: 'tabTextColor',
    cssName: 'tab-text-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
tabTextColorProperty.register(Style);
export const tabBackgroundColorProperty = new CssProperty({
    name: 'tabBackgroundColor',
    cssName: 'tab-background-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
tabBackgroundColorProperty.register(Style);
export const selectedTabTextColorProperty = new CssProperty({
    name: 'selectedTabTextColor',
    cssName: 'selected-tab-text-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
selectedTabTextColorProperty.register(Style);
export const androidSelectedTabHighlightColorProperty = new CssProperty({
    name: 'androidSelectedTabHighlightColor',
    cssName: 'android-selected-tab-highlight-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
androidSelectedTabHighlightColorProperty.register(Style);
//# sourceMappingURL=tab-view-common.js.map