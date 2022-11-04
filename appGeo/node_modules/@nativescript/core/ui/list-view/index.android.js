import { ListViewBase, separatorColorProperty, itemTemplatesProperty } from './list-view-common';
import { unsetValue } from '../core/properties';
import { Color } from '../../color';
import { Observable } from '../../data/observable';
import { StackLayout } from '../layouts/stack-layout';
import { ProxyViewContainer } from '../proxy-view-container';
import { LayoutBase } from '../layouts/layout-base';
import { profile } from '../../profiling';
export * from './list-view-common';
const ITEMLOADING = ListViewBase.itemLoadingEvent;
const LOADMOREITEMS = ListViewBase.loadMoreItemsEvent;
const ITEMTAP = ListViewBase.itemTapEvent;
let ItemClickListener;
function initializeItemClickListener() {
    if (ItemClickListener) {
        return;
    }
    var ItemClickListenerImpl = /** @class */ (function (_super) {
    __extends(ItemClickListenerImpl, _super);
    function ItemClickListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ItemClickListenerImpl.prototype.onItemClick = function (parent, convertView, index, id) {
        var owner = this.owner;
        var view = owner._realizedItems.get(convertView).view;
        owner.notify({
            eventName: ITEMTAP,
            object: owner,
            index: index,
            view: view,
        });
    };
    ItemClickListenerImpl = __decorate([
        Interfaces([android.widget.AdapterView.OnItemClickListener])
    ], ItemClickListenerImpl);
    return ItemClickListenerImpl;
}(java.lang.Object));
    ItemClickListener = ItemClickListenerImpl;
}
export class ListView extends ListViewBase {
    constructor() {
        super(...arguments);
        this._androidViewId = -1;
        this._realizedItems = new Map();
        this._availableViews = new Map();
        this._realizedTemplates = new Map();
    }
    _ensureAvailableViews(templateKey) {
        if (!this._availableViews.has(templateKey)) {
            this._availableViews.set(templateKey, new Set());
        }
    }
    _registerViewToTemplate(templateKey, nativeView, view) {
        this._realizedItems.set(nativeView, {
            view,
            templateKey,
        });
        if (!this._realizedTemplates.has(templateKey)) {
            this._realizedTemplates.set(templateKey, new Map());
        }
        this._realizedTemplates.get(templateKey).set(nativeView, view);
        this._ensureAvailableViews(templateKey);
        const availableViews = this._availableViews.get(templateKey);
        availableViews.add(nativeView);
    }
    _markViewUsed(nativeView) {
        const viewData = this._realizedItems.get(nativeView);
        if (!viewData) {
            throw new Error('View not registered');
        }
        this._ensureAvailableViews(viewData.templateKey);
        this._availableViews.get(viewData.templateKey).delete(nativeView);
    }
    _markViewUnused(nativeView) {
        const viewData = this._realizedItems.get(nativeView);
        if (!viewData) {
            throw new Error('View not registered');
        }
        this._ensureAvailableViews(viewData.templateKey);
        this._availableViews.get(viewData.templateKey).add(nativeView);
    }
    _getKeyFromView(nativeView) {
        return this._realizedItems.get(nativeView).templateKey;
    }
    _hasAvailableView(templateKey) {
        this._ensureAvailableViews(templateKey);
        return this._availableViews.get(templateKey).size > 0;
    }
    _getAvailableView(templateKey) {
        this._ensureAvailableViews(templateKey);
        if (!this._hasAvailableView(templateKey)) {
            return null;
        }
        const view = this._availableViews.get(templateKey).values().next().value;
        this._markViewUsed(view);
        return view;
    }
    createNativeView() {
        const listView = new android.widget.ListView(this._context);
        listView.setDescendantFocusability(android.view.ViewGroup.FOCUS_AFTER_DESCENDANTS);
        // Fixes issue with black random black items when scrolling
        listView.setCacheColorHint(android.graphics.Color.TRANSPARENT);
        return listView;
    }
    initNativeView() {
        super.initNativeView();
        this.updateEffectiveRowHeight();
        const nativeView = this.nativeViewProtected;
        initializeItemClickListener();
        ensureListViewAdapterClass();
        const adapter = new ListViewAdapterClass(this);
        nativeView.setAdapter(adapter);
        nativeView.adapter = adapter;
        const itemClickListener = new ItemClickListener(this);
        nativeView.setOnItemClickListener(itemClickListener);
        nativeView.itemClickListener = itemClickListener;
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        nativeView.setId(this._androidViewId);
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        nativeView.setAdapter(null);
        nativeView.itemClickListener.owner = null;
        nativeView.adapter.owner = null;
        this.clearRealizedCells();
        super.disposeNativeView();
    }
    onLoaded() {
        super.onLoaded();
        // Without this call itemClick won't be fired... :(
        this.requestLayout();
    }
    refresh() {
        const nativeView = this.nativeViewProtected;
        if (!nativeView || !nativeView.getAdapter()) {
            return;
        }
        // clear bindingContext when it is not observable because otherwise bindings to items won't reevaluate
        this._realizedItems.forEach(({ view }, nativeView) => {
            if (!(view.bindingContext instanceof Observable)) {
                view.bindingContext = null;
            }
        });
        nativeView.getAdapter().notifyDataSetChanged();
    }
    scrollToIndex(index) {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.setSelection(index);
        }
    }
    scrollToIndexAnimated(index) {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.smoothScrollToPosition(index);
        }
    }
    get _childrenCount() {
        return this._realizedItems.size;
    }
    eachChildView(callback) {
        this._realizedItems.forEach(({ view }, nativeView) => {
            if (view.parent instanceof ListView) {
                callback(view);
            }
            else {
                // in some cases (like item is unloaded from another place (like angular) view.parent becomes undefined)
                if (view.parent) {
                    callback(view.parent);
                }
            }
        });
    }
    _dumpRealizedTemplates() {
        console.log(`Realized Templates:`);
        this._realizedTemplates.forEach((value, index) => {
            console.log(`\t${index}:`);
            value.forEach((value, index) => {
                console.log(`\t\t${index.hashCode()}: ${value}`);
            });
        });
        console.log(`Realized Items Size: ${this._realizedItems.size}`);
    }
    clearRealizedCells() {
        // clear the cache
        this._realizedItems.forEach(({ view }, nativeView) => {
            if (view.parent) {
                // This is to clear the StackLayout that is used to wrap non LayoutBase & ProxyViewContainer instances.
                if (!(view.parent instanceof ListView)) {
                    this._removeView(view.parent);
                }
                view.parent._removeView(view);
            }
        });
        this._realizedItems.clear();
        this._availableViews.clear();
        this._realizedTemplates.clear();
    }
    isItemAtIndexVisible(index) {
        const nativeView = this.nativeViewProtected;
        const start = nativeView.getFirstVisiblePosition();
        const end = nativeView.getLastVisiblePosition();
        return index >= start && index <= end;
    }
    [separatorColorProperty.getDefault]() {
        const nativeView = this.nativeViewProtected;
        return {
            dividerHeight: nativeView.getDividerHeight(),
            divider: nativeView.getDivider(),
        };
    }
    [separatorColorProperty.setNative](value) {
        const nativeView = this.nativeViewProtected;
        if (value instanceof Color) {
            nativeView.setDivider(new android.graphics.drawable.ColorDrawable(value.android));
            nativeView.setDividerHeight(1);
        }
        else {
            nativeView.setDivider(value.divider);
            nativeView.setDividerHeight(value.dividerHeight);
        }
    }
    [itemTemplatesProperty.getDefault]() {
        return null;
    }
    [itemTemplatesProperty.setNative](value) {
        this._itemTemplatesInternal = new Array(this._defaultTemplate);
        if (value) {
            this._itemTemplatesInternal = this._itemTemplatesInternal.concat(value);
        }
        this.nativeViewProtected.setAdapter(new ListViewAdapterClass(this));
        this.refresh();
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ListView.prototype, "createNativeView", null);
let ListViewAdapterClass;
function ensureListViewAdapterClass() {
    if (ListViewAdapterClass) {
        return;
    }
    var ListViewAdapter = /** @class */ (function (_super) {
    __extends(ListViewAdapter, _super);
    function ListViewAdapter(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ListViewAdapter.prototype.getCount = function () {
        return this.owner && this.owner.items && this.owner.items.length ? this.owner.items.length : 0;
    };
    ListViewAdapter.prototype.getItem = function (i) {
        if (this.owner && this.owner.items && i < this.owner.items.length) {
            var getItem = this.owner.items.getItem;
            return getItem ? getItem.call(this.owner.items, i) : this.owner.items[i];
        }
        return null;
    };
    ListViewAdapter.prototype.getItemId = function (i) {
        var item = this.getItem(i);
        var id = i;
        if (this.owner && item && this.owner.items) {
            id = this.owner.itemIdGenerator(item, i, this.owner.items);
        }
        return long(id);
    };
    ListViewAdapter.prototype.hasStableIds = function () {
        return true;
    };
    ListViewAdapter.prototype.getViewTypeCount = function () {
        return this.owner._itemTemplatesInternal.length;
    };
    ListViewAdapter.prototype.getItemViewType = function (index) {
        var template = this.owner._getItemTemplate(index);
        var itemViewType = this.owner._itemTemplatesInternal.indexOf(template);
        return itemViewType;
    };
    ListViewAdapter.prototype.getView = function (index, convertView, parent) {
        //this.owner._dumpRealizedTemplates();
        if (!this.owner) {
            return null;
        }
        var totalItemCount = this.owner.items ? this.owner.items.length : 0;
        if (index === totalItemCount - 1) {
            this.owner.notify({
                eventName: LOADMOREITEMS,
                object: this.owner,
            });
        }
        // Recycle an existing view or create a new one if needed.
        var template = this.owner._getItemTemplate(index);
        var view;
        // convertView is of the wrong type
        if (convertView && this.owner._getKeyFromView(convertView) !== template.key) {
            this.owner._markViewUnused(convertView); // release this view
            convertView = this.owner._getAvailableView(template.key); // get a view from the right type or null
        }
        if (convertView) {
            view = this.owner._realizedItems.get(convertView).view;
        }
        if (!view) {
            view = template.createView();
        }
        var args = {
            eventName: ITEMLOADING,
            object: this.owner,
            index: index,
            view: view,
            android: parent,
            ios: undefined,
        };
        this.owner.notify(args);
        if (!args.view) {
            args.view = this.owner._getDefaultItemContent(index);
        }
        if (args.view) {
            if (this.owner._effectiveRowHeight > -1) {
                args.view.height = this.owner.rowHeight;
            }
            else {
                args.view.height = unsetValue;
            }
            this.owner._prepareItem(args.view, index);
            if (!args.view.parent) {
                // Proxy containers should not get treated as layouts.
                // Wrap them in a real layout as well.
                if (args.view instanceof LayoutBase && !(args.view instanceof ProxyViewContainer)) {
                    this.owner._addView(args.view);
                    convertView = args.view.nativeViewProtected;
                }
                else {
                    var sp = new StackLayout();
                    sp.addChild(args.view);
                    this.owner._addView(sp);
                    convertView = sp.nativeViewProtected;
                }
            }
            this.owner._registerViewToTemplate(template.key, convertView, args.view);
            this.owner._markViewUsed(convertView);
        }
        return convertView;
    };
    __decorate([
        profile
    ], ListViewAdapter.prototype, "getView", null);
    return ListViewAdapter;
}(android.widget.BaseAdapter));
    ListViewAdapterClass = ListViewAdapter;
}
//# sourceMappingURL=index.android.js.map