import { Font } from '../styling/font';
import { TabViewBase, TabViewItemBase, itemsProperty, selectedIndexProperty, tabTextColorProperty, tabBackgroundColorProperty, tabTextFontSizeProperty, selectedTabTextColorProperty, androidSelectedTabHighlightColorProperty, androidOffscreenTabLimitProperty, traceCategory, traceMissingIcon, androidIconRenderingModeProperty } from './tab-view-common';
import { textTransformProperty, getTransformedText } from '../text-base';
import { ImageSource } from '../../image-source';
import { Trace } from '../../trace';
import { Color } from '../../color';
import { fontSizeProperty, fontInternalProperty } from '../styling/style-properties';
import { RESOURCE_PREFIX, ad, layout } from '../../utils';
import { Frame } from '../frame';
import * as application from '../../application';
export * from './tab-view-common';
const ACCENT_COLOR = 'colorAccent';
const PRIMARY_COLOR = 'colorPrimary';
const DEFAULT_ELEVATION = 4;
const TABID = '_tabId';
const INDEX = '_index';
let PagerAdapter;
let appResources;
function makeFragmentName(viewId, id) {
    return 'android:viewpager:' + viewId + ':' + id;
}
function getTabById(id) {
    const ref = tabs.find((ref) => {
        const tab = ref.get();
        return tab && tab._domId === id;
    });
    return ref && ref.get();
}
function initializeNativeClasses() {
    if (PagerAdapter) {
        return;
    }
    var TabFragmentImplementation = /** @class */ (function (_super) {
    __extends(TabFragmentImplementation, _super);
    function TabFragmentImplementation() {
        var _this = _super.call(this) || this;
        _this.backgroundBitmap = null;
        return global.__native(_this);
    }
    TabFragmentImplementation.newInstance = function (tabId, index) {
        var args = new android.os.Bundle();
        args.putInt(TABID, tabId);
        args.putInt(INDEX, index);
        var fragment = new TabFragmentImplementation();
        fragment.setArguments(args);
        return fragment;
    };
    TabFragmentImplementation.prototype.onCreate = function (savedInstanceState) {
        _super.prototype.onCreate.call(this, savedInstanceState);
        var args = this.getArguments();
        this.owner = getTabById(args.getInt(TABID));
        this.index = args.getInt(INDEX);
        if (!this.owner) {
            throw new Error("Cannot find TabView");
        }
    };
    TabFragmentImplementation.prototype.onCreateView = function (inflater, container, savedInstanceState) {
        var tabItem = this.owner.items[this.index];
        return tabItem.view.nativeViewProtected;
    };
    TabFragmentImplementation.prototype.onDestroyView = function () {
        var hasRemovingParent = this.getRemovingParentFragment();
        // Get view as bitmap and set it as background. This is workaround for the disapearing nested fragments.
        // TODO: Consider removing it when update to androidx.fragment:1.2.0
        if (hasRemovingParent && this.owner.selectedIndex === this.index) {
            var bitmapDrawable = new android.graphics.drawable.BitmapDrawable(appResources, this.backgroundBitmap);
            this.owner._originalBackground = this.owner.backgroundColor || new Color('White');
            this.owner.nativeViewProtected.setBackground(bitmapDrawable);
            this.backgroundBitmap = null;
        }
        _super.prototype.onDestroyView.call(this);
    };
    TabFragmentImplementation.prototype.onPause = function () {
        var hasRemovingParent = this.getRemovingParentFragment();
        // Get view as bitmap and set it as background. This is workaround for the disapearing nested fragments.
        // TODO: Consider removing it when update to androidx.fragment:1.2.0
        if (hasRemovingParent && this.owner.selectedIndex === this.index) {
            this.backgroundBitmap = this.loadBitmapFromView(this.owner.nativeViewProtected);
        }
        _super.prototype.onPause.call(this);
    };
    TabFragmentImplementation.prototype.loadBitmapFromView = function (view) {
        // Another way to get view bitmap. Test performance vs setDrawingCacheEnabled
        // const width = view.getWidth();
        // const height = view.getHeight();
        // const bitmap = android.graphics.Bitmap.createBitmap(width, height, android.graphics.Bitmap.Config.ARGB_8888);
        // const canvas = new android.graphics.Canvas(bitmap);
        // view.layout(0, 0, width, height);
        // view.draw(canvas);
        view.setDrawingCacheEnabled(true);
        var bitmap = android.graphics.Bitmap.createBitmap(view.getDrawingCache());
        view.setDrawingCacheEnabled(false);
        return bitmap;
    };
    return TabFragmentImplementation;
}(org.nativescript.widgets.FragmentBase));
    const POSITION_UNCHANGED = -1;
    const POSITION_NONE = -2;
    var FragmentPagerAdapter = /** @class */ (function (_super) {
    __extends(FragmentPagerAdapter, _super);
    function FragmentPagerAdapter(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        // in fragments 1.3+, committing a transaction may call the adapter's methods and trigger another commit
        // we prevent that here.
        _this.transactionRunning = false;
        return global.__native(_this);
    }
    FragmentPagerAdapter.prototype.getCount = function () {
        var items = this.items;
        return items ? items.length : 0;
    };
    FragmentPagerAdapter.prototype.getPageTitle = function (index) {
        var items = this.items;
        if (index < 0 || index >= items.length) {
            return '';
        }
        return items[index].title;
    };
    FragmentPagerAdapter.prototype.startUpdate = function (container) {
        if (container.getId() === android.view.View.NO_ID) {
            throw new Error("ViewPager with adapter ".concat(this, " requires a view containerId"));
        }
    };
    FragmentPagerAdapter.prototype.instantiateItem = function (container, position) {
        var fragmentManager = this.owner._getFragmentManager();
        if (!this.mCurTransaction) {
            this.mCurTransaction = fragmentManager.beginTransaction();
        }
        var itemId = this.getItemId(position);
        var name = makeFragmentName(container.getId(), itemId);
        var fragment = fragmentManager.findFragmentByTag(name);
        if (fragment != null) {
            this.mCurTransaction.attach(fragment);
        }
        else {
            fragment = TabFragmentImplementation.newInstance(this.owner._domId, position);
            this.mCurTransaction.add(container.getId(), fragment, name);
        }
        if (fragment !== this.mCurrentPrimaryItem) {
            fragment.setMenuVisibility(false);
            fragment.setUserVisibleHint(false);
        }
        var tabItems = this.owner.items;
        var tabItem = tabItems ? tabItems[position] : null;
        if (tabItem) {
            tabItem.canBeLoaded = true;
        }
        return fragment;
    };
    FragmentPagerAdapter.prototype.getItemPosition = function (object) {
        return this.items ? POSITION_UNCHANGED : POSITION_NONE;
    };
    FragmentPagerAdapter.prototype.destroyItem = function (container, position, object) {
        if (!this.mCurTransaction) {
            var fragmentManager = this.owner._getFragmentManager();
            this.mCurTransaction = fragmentManager.beginTransaction();
        }
        var fragment = object;
        this.mCurTransaction.detach(fragment);
        if (this.mCurrentPrimaryItem === fragment) {
            this.mCurrentPrimaryItem = null;
        }
        var tabItems = this.owner.items;
        var tabItem = tabItems ? tabItems[position] : null;
        if (tabItem) {
            tabItem.canBeLoaded = false;
        }
    };
    FragmentPagerAdapter.prototype.setPrimaryItem = function (container, position, object) {
        var fragment = object;
        if (fragment !== this.mCurrentPrimaryItem) {
            if (this.mCurrentPrimaryItem != null) {
                this.mCurrentPrimaryItem.setMenuVisibility(false);
                this.mCurrentPrimaryItem.setUserVisibleHint(false);
            }
            if (fragment != null) {
                fragment.setMenuVisibility(true);
                fragment.setUserVisibleHint(true);
            }
            this.mCurrentPrimaryItem = fragment;
            this.owner.selectedIndex = position;
            var tab = this.owner;
            var tabItems = tab.items;
            var newTabItem = tabItems ? tabItems[position] : null;
            if (newTabItem) {
                tab._loadUnloadTabItems(tab.selectedIndex);
            }
        }
    };
    FragmentPagerAdapter.prototype.finishUpdate = function (container) {
        this._commitCurrentTransaction();
    };
    FragmentPagerAdapter.prototype.isViewFromObject = function (view, object) {
        return object.getView() === view;
    };
    FragmentPagerAdapter.prototype.saveState = function () {
        // Commit the current transaction on save to prevent "No view found for id 0xa" exception on restore.
        // Related to: https://github.com/NativeScript/NativeScript/issues/6466
        this._commitCurrentTransaction();
        return null;
    };
    FragmentPagerAdapter.prototype.restoreState = function (state, loader) {
        //
    };
    FragmentPagerAdapter.prototype.getItemId = function (position) {
        return position;
    };
    FragmentPagerAdapter.prototype._commitCurrentTransaction = function () {
        if (this.mCurTransaction != null && !this.transactionRunning) {
            this.transactionRunning = true;
            this.mCurTransaction.commitNowAllowingStateLoss();
            this.transactionRunning = false;
            this.mCurTransaction = null;
        }
    };
    return FragmentPagerAdapter;
}(androidx.viewpager.widget.PagerAdapter));
    PagerAdapter = FragmentPagerAdapter;
    appResources = application.android.context.getResources();
}
function createTabItemSpec(item) {
    const result = new org.nativescript.widgets.TabItemSpec();
    result.title = item.title;
    if (item.iconSource) {
        if (item.iconSource.indexOf(RESOURCE_PREFIX) === 0) {
            result.iconId = ad.resources.getDrawableId(item.iconSource.substr(RESOURCE_PREFIX.length));
            if (result.iconId === 0) {
                traceMissingIcon(item.iconSource);
            }
        }
        else {
            const is = ImageSource.fromFileOrResourceSync(item.iconSource);
            if (is) {
                // TODO: Make this native call that accepts string so that we don't load Bitmap in JS.
                result.iconDrawable = new android.graphics.drawable.BitmapDrawable(appResources, is.android);
            }
            else {
                traceMissingIcon(item.iconSource);
            }
        }
    }
    return result;
}
let defaultAccentColor = undefined;
function getDefaultAccentColor(context) {
    if (defaultAccentColor === undefined) {
        //Fallback color: https://developer.android.com/samples/SlidingTabsColors/src/com.example.android.common/view/SlidingTabStrip.html
        defaultAccentColor = ad.resources.getPaletteColor(ACCENT_COLOR, context) || 0xff33b5e5;
    }
    return defaultAccentColor;
}
export class TabViewItem extends TabViewItemBase {
    get _hasFragments() {
        return true;
    }
    initNativeView() {
        super.initNativeView();
        if (this.nativeViewProtected) {
            this._defaultTransformationMethod = this.nativeViewProtected.getTransformationMethod();
        }
    }
    onLoaded() {
        super.onLoaded();
    }
    resetNativeView() {
        super.resetNativeView();
        if (this.nativeViewProtected) {
            // We reset it here too because this could be changed by multiple properties - whiteSpace, secure, textTransform
            this.nativeViewProtected.setTransformationMethod(this._defaultTransformationMethod);
        }
    }
    disposeNativeView() {
        super.disposeNativeView();
        this.canBeLoaded = false;
    }
    createNativeView() {
        return this.nativeViewProtected;
    }
    _update() {
        const tv = this.nativeViewProtected;
        const tabView = this.parent;
        if (tv && tabView) {
            this.tabItemSpec = createTabItemSpec(this);
            tabView.updateAndroidItemAt(this.index, this.tabItemSpec);
        }
    }
    _getChildFragmentManager() {
        const tabView = this.parent;
        let tabFragment = null;
        const fragmentManager = tabView._getFragmentManager();
        const fragments = fragmentManager.getFragments().toArray();
        for (let i = 0; i < fragments.length; i++) {
            if (fragments[i].index === this.index) {
                tabFragment = fragments[i];
                break;
            }
        }
        // TODO: can happen in a modal tabview scenario when the modal dialog fragment is already removed
        if (!tabFragment) {
            if (Trace.isEnabled()) {
                Trace.write(`Could not get child fragment manager for tab item with index ${this.index}`, traceCategory);
            }
            return tabView._getRootFragmentManager();
        }
        return tabFragment.getChildFragmentManager();
    }
    [fontSizeProperty.getDefault]() {
        return { nativeSize: this.nativeViewProtected.getTextSize() };
    }
    [fontSizeProperty.setNative](value) {
        if (typeof value === 'number') {
            this.nativeViewProtected.setTextSize(value);
        }
        else {
            this.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }
    [fontInternalProperty.getDefault]() {
        return this.nativeViewProtected.getTypeface();
    }
    [fontInternalProperty.setNative](value) {
        this.nativeViewProtected.setTypeface(value instanceof Font ? value.getAndroidTypeface() : value);
    }
    [textTransformProperty.getDefault]() {
        return 'default';
    }
    [textTransformProperty.setNative](value) {
        const tv = this.nativeViewProtected;
        if (value === 'default') {
            tv.setTransformationMethod(this._defaultTransformationMethod);
            tv.setText(this.title);
        }
        else {
            const result = getTransformedText(this.title, value);
            tv.setText(result);
            tv.setTransformationMethod(null);
        }
    }
}
function setElevation(grid, tabLayout) {
    const compat = androidx.core.view.ViewCompat;
    if (compat.setElevation) {
        const val = DEFAULT_ELEVATION * layout.getDisplayDensity();
        compat.setElevation(grid, val);
        compat.setElevation(tabLayout, val);
    }
}
export const tabs = new Array();
function iterateIndexRange(index, eps, lastIndex, callback) {
    const rangeStart = Math.max(0, index - eps);
    const rangeEnd = Math.min(index + eps, lastIndex);
    for (let i = rangeStart; i <= rangeEnd; i++) {
        callback(i);
    }
}
export class TabView extends TabViewBase {
    constructor() {
        super();
        this._androidViewId = -1;
        tabs.push(new WeakRef(this));
    }
    get _hasFragments() {
        return true;
    }
    onItemsChanged(oldItems, newItems) {
        super.onItemsChanged(oldItems, newItems);
        if (oldItems) {
            oldItems.forEach((item, i, arr) => {
                item.index = 0;
                item.tabItemSpec = null;
                item.setNativeView(null);
            });
        }
    }
    createNativeView() {
        initializeNativeClasses();
        if (Trace.isEnabled()) {
            Trace.write('TabView._createUI(' + this + ');', traceCategory);
        }
        const context = this._context;
        const nativeView = new org.nativescript.widgets.GridLayout(context);
        const viewPager = new org.nativescript.widgets.TabViewPager(context);
        const tabLayout = new org.nativescript.widgets.TabLayout(context);
        const lp = new org.nativescript.widgets.CommonLayoutParams();
        const primaryColor = ad.resources.getPaletteColor(PRIMARY_COLOR, context);
        let accentColor = getDefaultAccentColor(context);
        lp.row = 1;
        if (this.androidTabsPosition === 'top') {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            viewPager.setLayoutParams(lp);
            if (!this.androidSwipeEnabled) {
                viewPager.setSwipePageEnabled(false);
            }
        }
        else {
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.star));
            nativeView.addRow(new org.nativescript.widgets.ItemSpec(1, org.nativescript.widgets.GridUnitType.auto));
            tabLayout.setLayoutParams(lp);
            viewPager.setSwipePageEnabled(false);
            // set completely transparent accent color for tab selected indicator.
            accentColor = 0x00ffffff;
        }
        nativeView.addView(viewPager);
        nativeView.viewPager = viewPager;
        const adapter = new PagerAdapter(this);
        viewPager.setAdapter(adapter);
        viewPager.adapter = adapter;
        nativeView.addView(tabLayout);
        nativeView.tabLayout = tabLayout;
        setElevation(nativeView, tabLayout);
        if (accentColor) {
            tabLayout.setSelectedIndicatorColors([accentColor]);
        }
        if (primaryColor) {
            tabLayout.setBackgroundColor(primaryColor);
        }
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        const nativeView = this.nativeViewProtected;
        this._tabLayout = nativeView.tabLayout;
        const viewPager = nativeView.viewPager;
        viewPager.setId(this._androidViewId);
        this._viewPager = viewPager;
        this._pagerAdapter = viewPager.adapter;
        this._pagerAdapter.owner = this;
    }
    _loadUnloadTabItems(newIndex) {
        const items = this.items;
        if (!items) {
            return;
        }
        const lastIndex = items.length - 1;
        const offsideItems = this.androidTabsPosition === 'top' ? this.androidOffscreenTabLimit : 1;
        const toUnload = [];
        const toLoad = [];
        iterateIndexRange(newIndex, offsideItems, lastIndex, (i) => toLoad.push(i));
        items.forEach((item, i) => {
            const indexOfI = toLoad.indexOf(i);
            if (indexOfI < 0) {
                toUnload.push(i);
            }
        });
        toUnload.forEach((index) => {
            const item = items[index];
            if (items[index]) {
                item.unloadView(item.view);
            }
        });
        const newItem = items[newIndex];
        const selectedView = newItem && newItem.view;
        if (selectedView instanceof Frame) {
            selectedView._pushInFrameStackRecursive();
        }
        toLoad.forEach((index) => {
            const item = items[index];
            if (this.isLoaded && items[index]) {
                item.loadView(item.view);
            }
        });
    }
    onLoaded() {
        super.onLoaded();
        if (this._originalBackground) {
            this.backgroundColor = null;
            this.backgroundColor = this._originalBackground;
            this._originalBackground = null;
        }
        this.setAdapterItems(this.items);
    }
    onUnloaded() {
        super.onUnloaded();
        this.setAdapterItems(null);
    }
    disposeNativeView() {
        this._tabLayout.setItems(null, null);
        this._pagerAdapter.owner = null;
        this._pagerAdapter = null;
        this._tabLayout = null;
        this._viewPager = null;
        super.disposeNativeView();
    }
    _onRootViewReset() {
        super._onRootViewReset();
        // call this AFTER the super call to ensure descendants apply their rootview-reset logic first
        // i.e. in a scenario with tab frames let the frames cleanup their fragments first, and then
        // cleanup the tab fragments to avoid
        // android.content.res.Resources$NotFoundException: Unable to find resource ID #0xfffffff6
        this.disposeCurrentFragments();
    }
    disposeCurrentFragments() {
        const fragmentManager = this._getFragmentManager();
        const transaction = fragmentManager.beginTransaction();
        const fragments = fragmentManager.getFragments().toArray();
        for (let i = 0; i < fragments.length; i++) {
            transaction.remove(fragments[i]);
        }
        transaction.commitNowAllowingStateLoss();
    }
    shouldUpdateAdapter(items) {
        if (!this._pagerAdapter) {
            return false;
        }
        const currentPagerAdapterItems = this._pagerAdapter.items;
        // if both values are null, should not update
        if (!items && !currentPagerAdapterItems) {
            return false;
        }
        // if one value is null, should update
        if (!items || !currentPagerAdapterItems) {
            return true;
        }
        // if both are Arrays but length doesn't match, should update
        if (items.length !== currentPagerAdapterItems.length) {
            return true;
        }
        const matchingItems = currentPagerAdapterItems.filter((currentItem) => {
            return !!items.filter((item) => {
                return item._domId === currentItem._domId;
            })[0];
        });
        // if both are Arrays and length matches, but not all items are the same, should update
        if (matchingItems.length !== items.length) {
            return true;
        }
        // if both are Arrays and length matches and all items are the same, should not update
        return false;
    }
    setAdapterItems(items) {
        if (this.shouldUpdateAdapter(items)) {
            this._pagerAdapter.items = items;
            const length = items ? items.length : 0;
            if (length === 0) {
                this._tabLayout.setItems(null, null);
                this._pagerAdapter.notifyDataSetChanged();
                return;
            }
            const tabItems = new Array();
            items.forEach((item, i, arr) => {
                const tabItemSpec = createTabItemSpec(item);
                item.index = i;
                item.tabItemSpec = tabItemSpec;
                tabItems.push(tabItemSpec);
            });
            const tabLayout = this._tabLayout;
            tabLayout.setItems(tabItems, this._viewPager);
            items.forEach((item, i, arr) => {
                const tv = tabLayout.getTextViewForItemAt(i);
                item.setNativeView(tv);
            });
            this._pagerAdapter.notifyDataSetChanged();
        }
    }
    getNativeRenderingMode(mode) {
        switch (mode) {
            case 'alwaysTemplate':
                return org.nativescript.widgets.TabIconRenderingMode.template;
            default:
            case 'alwaysOriginal':
                return org.nativescript.widgets.TabIconRenderingMode.original;
        }
    }
    updateAndroidItemAt(index, spec) {
        this._tabLayout.updateItemAt(index, spec);
    }
    [androidOffscreenTabLimitProperty.getDefault]() {
        return this._viewPager.getOffscreenPageLimit();
    }
    [androidOffscreenTabLimitProperty.setNative](value) {
        this._viewPager.setOffscreenPageLimit(value);
    }
    [androidIconRenderingModeProperty.getDefault]() {
        return 'alwaysOriginal';
    }
    [androidIconRenderingModeProperty.setNative](value) {
        this._tabLayout.setIconRenderingMode(this.getNativeRenderingMode(value));
    }
    [selectedIndexProperty.setNative](value) {
        const smoothScroll = this.androidTabsPosition === 'top';
        if (Trace.isEnabled()) {
            Trace.write('TabView this._viewPager.setCurrentItem(' + value + ', ' + smoothScroll + ');', traceCategory);
        }
        this._viewPager.setCurrentItem(value, smoothScroll);
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        this.setAdapterItems(value);
        selectedIndexProperty.coerce(this);
    }
    [tabBackgroundColorProperty.getDefault]() {
        return this._tabLayout.getBackground();
    }
    [tabBackgroundColorProperty.setNative](value) {
        if (value instanceof Color) {
            this._tabLayout.setBackgroundColor(value.android);
        }
        else {
            this._tabLayout.setBackground(tryCloneDrawable(value, this.nativeViewProtected.getResources()));
        }
    }
    [tabTextFontSizeProperty.getDefault]() {
        return this._tabLayout.getTabTextFontSize();
    }
    [tabTextFontSizeProperty.setNative](value) {
        if (typeof value === 'number') {
            this._tabLayout.setTabTextFontSize(value);
        }
        else {
            this._tabLayout.setTabTextFontSize(value.nativeSize);
        }
    }
    [tabTextColorProperty.getDefault]() {
        return this._tabLayout.getTabTextColor();
    }
    [tabTextColorProperty.setNative](value) {
        const color = value instanceof Color ? value.android : value;
        this._tabLayout.setTabTextColor(color);
    }
    [selectedTabTextColorProperty.getDefault]() {
        return this._tabLayout.getSelectedTabTextColor();
    }
    [selectedTabTextColorProperty.setNative](value) {
        const color = value instanceof Color ? value.android : value;
        this._tabLayout.setSelectedTabTextColor(color);
    }
    [androidSelectedTabHighlightColorProperty.getDefault]() {
        return getDefaultAccentColor(this._context);
    }
    [androidSelectedTabHighlightColorProperty.setNative](value) {
        const tabLayout = this._tabLayout;
        const color = value instanceof Color ? value.android : value;
        tabLayout.setSelectedIndicatorColors([color]);
    }
}
function tryCloneDrawable(value, resources) {
    if (value) {
        const constantState = value.getConstantState();
        if (constantState) {
            return constantState.newDrawable(resources);
        }
    }
    return value;
}
//# sourceMappingURL=index.android.js.map