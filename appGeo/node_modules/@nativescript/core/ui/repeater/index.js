import { Label } from '../label';
import { View, CSSType, CustomLayoutView } from '../core/view';
import { Property } from '../core/properties';
import { layout } from '../../utils';
import { StackLayout } from '../layouts/stack-layout';
import { ObservableArray } from '../../data/observable-array';
import { addWeakEventListener, removeWeakEventListener } from '../core/weak-event-listener';
import { Builder } from '../builder';
import { profile } from '../../profiling';
/**
 * Represents a UI Repeater component.
 */
let Repeater = class Repeater extends CustomLayoutView {
    constructor() {
        super();
        this._isDirty = false;
        // TODO: Do we need this as property?
        this.itemsLayout = new StackLayout();
    }
    onLoaded() {
        if (this._isDirty) {
            this.refresh();
        }
        super.onLoaded();
    }
    get itemTemplateSelector() {
        return this._itemTemplateSelector;
    }
    set itemTemplateSelector(value) {
        if (typeof value === 'string') {
            if (!this._itemTemplateSelectorBindable) {
                this._itemTemplateSelectorBindable = new Label();
            }
            this._itemTemplateSelectorBindable.bind({
                sourceProperty: null,
                targetProperty: 'templateKey',
                expression: value,
            });
            this._itemTemplateSelector = (item, index, items) => {
                item['$index'] = index;
                if (this._itemTemplateSelectorBindable.bindingContext === item) {
                    this._itemTemplateSelectorBindable.bindingContext = null;
                }
                this._itemTemplateSelectorBindable.bindingContext = item;
                return this._itemTemplateSelectorBindable.get('templateKey');
            };
        }
        else if (typeof value === 'function') {
            this._itemTemplateSelector = value;
        }
    }
    _requestRefresh() {
        this._isDirty = true;
        if (this.isLoaded) {
            this.refresh();
        }
    }
    /**
     * Forces the Repeater to reload all its items.
     */
    refresh() {
        if (this.itemsLayout) {
            this.itemsLayout.removeChildren();
        }
        if (!this.items) {
            return;
        }
        const length = this.items.length;
        for (let i = 0; i < length; i++) {
            const dataItem = this._getDataItem(i);
            let viewToAdd = null;
            if (this._itemTemplateSelector && this.itemTemplates) {
                const key = this._itemTemplateSelector(dataItem, i, this.items);
                const length2 = this.itemTemplates.length;
                for (let j = 0; j < length2; j++) {
                    const template = this.itemTemplates[j];
                    if (template.key === key) {
                        viewToAdd = template.createView();
                        break;
                    }
                }
            }
            if (!viewToAdd) {
                if (__UI_USE_EXTERNAL_RENDERER__) {
                    viewToAdd = this._getDefaultItemContent(i);
                }
                else {
                    viewToAdd = this.itemTemplate ? Builder.parse(this.itemTemplate, this) : this._getDefaultItemContent(i);
                }
            }
            viewToAdd.bindingContext = dataItem;
            this.itemsLayout.addChild(viewToAdd);
        }
        this._isDirty = false;
    }
    _onItemsChanged(data) {
        // TODO: use the event args and optimize this code by remove/add single items instead of full rebuild.
        this._requestRefresh();
    }
    _getDefaultItemContent(index) {
        const lbl = new Label();
        lbl.bind({
            targetProperty: 'text',
            sourceProperty: '$value',
        });
        return lbl;
    }
    _getDataItem(index) {
        const items = this.items;
        return items.getItem ? items.getItem(index) : this.items[index];
    }
    get _childrenCount() {
        return this.itemsLayout ? 1 : 0;
    }
    eachChildView(callback) {
        if (this.itemsLayout) {
            callback(this.itemsLayout);
        }
    }
    onLayout(left, top, right, bottom) {
        const insets = this.getSafeAreaInsets();
        const paddingLeft = this.effectiveBorderLeftWidth + this.effectivePaddingLeft + insets.left;
        const paddingTop = this.effectiveBorderTopWidth + this.effectivePaddingTop + insets.top;
        const paddingRight = this.effectiveBorderRightWidth + this.effectivePaddingRight + insets.right;
        const paddingBottom = this.effectiveBorderBottomWidth + this.effectivePaddingBottom + insets.bottom;
        const childLeft = paddingLeft;
        const childTop = paddingTop;
        const childRight = right - left - paddingRight;
        const childBottom = bottom - top - paddingBottom;
        View.layoutChild(this, this.itemsLayout, childLeft, childTop, childRight, childBottom);
    }
    onMeasure(widthMeasureSpec, heightMeasureSpec) {
        const result = View.measureChild(this, this.itemsLayout, widthMeasureSpec, heightMeasureSpec);
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);
        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        const widthAndState = View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    }
};
// TODO: get rid of such hacks.
Repeater.knownFunctions = ['itemTemplateSelector']; // See component-builder.ts isKnownFunction
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Repeater.prototype, "onLoaded", null);
Repeater = __decorate([
    CSSType('Repeater'),
    __metadata("design:paramtypes", [])
], Repeater);
export { Repeater };
Repeater.prototype.recycleNativeView = 'auto';
/**
 * Represents the item template property of each Repeater instance.
 */
export const itemTemplateProperty = new Property({
    name: 'itemTemplate',
    affectsLayout: true,
    valueChanged: (target) => {
        target._requestRefresh();
    },
});
itemTemplateProperty.register(Repeater);
/**
 * Represents the items template property of each Repeater instance.
 */
export const itemTemplatesProperty = new Property({
    name: 'itemTemplates',
    affectsLayout: true,
    valueConverter: (value) => {
        if (typeof value === 'string') {
            if (__UI_USE_XML_PARSER__) {
                return Builder.parseMultipleTemplates(value, null);
            }
            else {
                return null;
            }
        }
        return value;
    },
    valueChanged: (target) => {
        target._requestRefresh();
    },
});
itemTemplatesProperty.register(Repeater);
/**
 * Represents the property backing the items property of each Repeater instance.
 */
export const itemsProperty = new Property({
    name: 'items',
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
        if (oldValue instanceof ObservableArray) {
            removeWeakEventListener(oldValue, ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        if (newValue instanceof ObservableArray) {
            addWeakEventListener(newValue, ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        target._requestRefresh();
    },
});
itemsProperty.register(Repeater);
export const itemsLayoutProperty = new Property({
    name: 'itemsLayout',
    affectsLayout: true,
    valueChanged: (target, oldValue, newValue) => {
        if (oldValue) {
            target._removeView(oldValue);
            oldValue.removeChildren();
        }
        if (newValue) {
            target._addView(newValue);
        }
        target._requestRefresh();
    },
});
itemsLayoutProperty.register(Repeater);
//# sourceMappingURL=index.js.map