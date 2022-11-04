import { ContainerView, CSSType } from '../core/view';
import { Property, CoercibleProperty, CssProperty } from '../core/properties';
import { Length } from '../styling/style-properties';
import { Style } from '../styling/style';
import { Color } from '../../color';
import { Builder } from '../builder';
import { Label } from '../label';
import { Observable } from '../../data/observable';
import { ObservableArray } from '../../data/observable-array';
import { addWeakEventListener, removeWeakEventListener } from '../core/weak-event-listener';
const autoEffectiveRowHeight = -1;
let ListViewBase = class ListViewBase extends ContainerView {
    constructor() {
        super(...arguments);
        this._itemIdGenerator = (_item, index) => index;
        this._itemTemplateSelectorBindable = new Label();
        this._defaultTemplate = {
            key: 'default',
            createView: () => {
                if (__UI_USE_EXTERNAL_RENDERER__) {
                }
                else if (this.itemTemplate) {
                    return Builder.parse(this.itemTemplate, this);
                }
                return undefined;
            },
        };
        this._itemTemplatesInternal = new Array(this._defaultTemplate);
        this._effectiveRowHeight = autoEffectiveRowHeight;
    }
    get separatorColor() {
        return this.style.separatorColor;
    }
    set separatorColor(value) {
        this.style.separatorColor = value;
    }
    get itemTemplateSelector() {
        return this._itemTemplateSelector;
    }
    set itemTemplateSelector(value) {
        if (typeof value === 'string') {
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
    get itemIdGenerator() {
        return this._itemIdGenerator;
    }
    set itemIdGenerator(generatorFn) {
        this._itemIdGenerator = generatorFn;
    }
    refresh() {
        //
    }
    scrollToIndex(index) {
        //
    }
    scrollToIndexAnimated(index) {
        //
    }
    _getItemTemplate(index) {
        let templateKey = 'default';
        if (this.itemTemplateSelector) {
            const dataItem = this._getDataItem(index);
            templateKey = this._itemTemplateSelector(dataItem, index, this.items);
        }
        for (let i = 0, length = this._itemTemplatesInternal.length; i < length; i++) {
            if (this._itemTemplatesInternal[i].key === templateKey) {
                return this._itemTemplatesInternal[i];
            }
        }
        // This is the default template
        return this._itemTemplatesInternal[0];
    }
    _prepareItem(item, index) {
        if (item) {
            item.bindingContext = this._getDataItem(index);
        }
    }
    _getDataItem(index) {
        const thisItems = this.items;
        return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
    }
    _getDefaultItemContent(index) {
        const lbl = new Label();
        lbl.bind({
            targetProperty: 'text',
            sourceProperty: '$value',
        });
        return lbl;
    }
    _onItemsChanged(args) {
        this.refresh();
    }
    _onRowHeightPropertyChanged(oldValue, newValue) {
        this.refresh();
    }
    isItemAtIndexVisible(index) {
        return false;
    }
    updateEffectiveRowHeight() {
        rowHeightProperty.coerce(this);
    }
};
ListViewBase.itemLoadingEvent = 'itemLoading';
ListViewBase.itemTapEvent = 'itemTap';
ListViewBase.loadMoreItemsEvent = 'loadMoreItems';
// TODO: get rid of such hacks.
ListViewBase.knownFunctions = ['itemTemplateSelector', 'itemIdGenerator']; //See component-builder.ts isKnownFunction
ListViewBase = __decorate([
    CSSType('ListView')
], ListViewBase);
export { ListViewBase };
ListViewBase.prototype.recycleNativeView = 'auto';
/**
 * Represents the property backing the items property of each ListView instance.
 */
export const itemsProperty = new Property({
    name: 'items',
    valueChanged: (target, oldValue, newValue) => {
        if (oldValue instanceof Observable) {
            removeWeakEventListener(oldValue, ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        if (newValue instanceof Observable) {
            addWeakEventListener(newValue, ObservableArray.changeEvent, target._onItemsChanged, target);
        }
        target.refresh();
    },
});
itemsProperty.register(ListViewBase);
/**
 * Represents the item template property of each ListView instance.
 */
export const itemTemplateProperty = new Property({
    name: 'itemTemplate',
    valueChanged: (target) => {
        target.refresh();
    },
});
itemTemplateProperty.register(ListViewBase);
/**
 * Represents the items template property of each ListView instance.
 */
export const itemTemplatesProperty = new Property({
    name: 'itemTemplates',
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
});
itemTemplatesProperty.register(ListViewBase);
const defaultRowHeight = 'auto';
/**
 * Represents the observable property backing the rowHeight property of each ListView instance.
 */
export const rowHeightProperty = new CoercibleProperty({
    name: 'rowHeight',
    defaultValue: defaultRowHeight,
    equalityComparer: Length.equals,
    coerceValue: (target, value) => {
        // We coerce to default value if we don't have display density.
        return target.nativeViewProtected ? value : defaultRowHeight;
    },
    valueChanged: (target, oldValue, newValue) => {
        target._effectiveRowHeight = Length.toDevicePixels(newValue, autoEffectiveRowHeight);
        target._onRowHeightPropertyChanged(oldValue, newValue);
    },
    valueConverter: Length.parse,
});
rowHeightProperty.register(ListViewBase);
export const iosEstimatedRowHeightProperty = new Property({
    name: 'iosEstimatedRowHeight',
    valueConverter: (v) => Length.parse(v),
});
iosEstimatedRowHeightProperty.register(ListViewBase);
export const separatorColorProperty = new CssProperty({
    name: 'separatorColor',
    cssName: 'separator-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
separatorColorProperty.register(Style);
//# sourceMappingURL=list-view-common.js.map