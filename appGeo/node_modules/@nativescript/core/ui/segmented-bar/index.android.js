import { Font } from '../styling/font';
import { SegmentedBarItemBase, SegmentedBarBase, selectedIndexProperty, itemsProperty, selectedBackgroundColorProperty } from './segmented-bar-common';
import { isEnabledProperty } from '../core/view';
import { colorProperty, fontInternalProperty, fontSizeProperty } from '../styling/style-properties';
import { Color } from '../../color';
import { layout } from '../../utils';
export * from './segmented-bar-common';
const R_ID_TABS = 0x01020013;
const R_ID_TABCONTENT = 0x01020011;
const R_ATTR_STATE_SELECTED = 0x010100a1;
const TITLE_TEXT_VIEW_ID = 16908310; // http://developer.android.com/reference/android/R.id.html#title
let apiLevel;
let selectedIndicatorThickness;
let TabHost;
let TabChangeListener;
let TabContentFactory;
// TODO: All TabHost public methods become deprecated in API 30.
function initializeNativeClasses() {
    if (TabChangeListener) {
        return;
    }
    apiLevel = android.os.Build.VERSION.SDK_INT;
    // Indicator thickness for material - 2dip. For pre-material - 5dip.
    selectedIndicatorThickness = layout.toDevicePixels(apiLevel >= 21 ? 2 : 5);
    var TabChangeListenerImpl = /** @class */ (function (_super) {
    __extends(TabChangeListenerImpl, _super);
    function TabChangeListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    TabChangeListenerImpl.prototype.onTabChanged = function (id) {
        var owner = this.owner;
        if (owner.shouldChangeSelectedIndex()) {
            owner.selectedIndex = parseInt(id);
        }
    };
    TabChangeListenerImpl = __decorate([
        Interfaces([android.widget.TabHost.OnTabChangeListener])
    ], TabChangeListenerImpl);
    return TabChangeListenerImpl;
}(java.lang.Object));
    var TabContentFactoryImpl = /** @class */ (function (_super) {
    __extends(TabContentFactoryImpl, _super);
    function TabContentFactoryImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    TabContentFactoryImpl.prototype.createTabContent = function (tag) {
        var tv = new android.widget.TextView(this.owner._context);
        // This is collapsed by default and made visible
        // by android when TabItem becomes visible/selected.
        // TODO: Try commenting visibility change.
        tv.setVisibility(android.view.View.GONE);
        tv.setMaxLines(1);
        tv.setEllipsize(android.text.TextUtils.TruncateAt.END);
        return tv;
    };
    TabContentFactoryImpl = __decorate([
        Interfaces([android.widget.TabHost.TabContentFactory])
    ], TabContentFactoryImpl);
    return TabContentFactoryImpl;
}(java.lang.Object));
    var TabHostImpl = /** @class */ (function (_super) {
    __extends(TabHostImpl, _super);
    function TabHostImpl(context, attrs) {
        var _this = _super.call(this, context, attrs) || this;
        return global.__native(_this);
    }
    TabHostImpl.prototype.onAttachedToWindow = function () {
        // overriden to remove the code that will steal the focus from edit fields.
    };
    return TabHostImpl;
}(android.widget.TabHost));
    TabHost = TabHostImpl;
    TabChangeListener = TabChangeListenerImpl;
    TabContentFactory = TabContentFactoryImpl;
}
export class SegmentedBarItem extends SegmentedBarItemBase {
    setupNativeView(tabIndex) {
        // TabHost.TabSpec.setIndicator DOES NOT WORK once the title has been set.
        // http://stackoverflow.com/questions/2935781/modify-tab-indicator-dynamically-in-android
        const titleTextView = this.parent.nativeViewProtected.getTabWidget().getChildAt(tabIndex).findViewById(TITLE_TEXT_VIEW_ID);
        this.setNativeView(titleTextView);
        if (titleTextView) {
            if (this.titleDirty) {
                this._update();
            }
        }
    }
    _update() {
        const tv = this.nativeViewProtected;
        if (tv) {
            let title = this.title;
            title = title === null || title === undefined ? '' : title;
            tv.setText(title);
            this.titleDirty = false;
        }
        else {
            this.titleDirty = true;
        }
    }
    [colorProperty.getDefault]() {
        return this.nativeViewProtected.getCurrentTextColor();
    }
    [colorProperty.setNative](value) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.setTextColor(color);
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
    [selectedBackgroundColorProperty.getDefault]() {
        const viewGroup = this.nativeViewProtected.getParent();
        return viewGroup.getBackground();
    }
    [selectedBackgroundColorProperty.setNative](value) {
        const nativeView = this.nativeViewProtected;
        const viewGroup = nativeView.getParent();
        if (value instanceof Color) {
            const color = value.android;
            const backgroundDrawable = viewGroup.getBackground();
            if (apiLevel > 21 && backgroundDrawable) {
                const newDrawable = tryCloneDrawable(backgroundDrawable, nativeView.getResources());
                newDrawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_IN);
                viewGroup.setBackground(newDrawable);
            }
            else {
                const stateDrawable = new android.graphics.drawable.StateListDrawable();
                const colorDrawable = new org.nativescript.widgets.SegmentedBarColorDrawable(color, selectedIndicatorThickness);
                const arr = Array.create('int', 1);
                arr[0] = R_ATTR_STATE_SELECTED;
                stateDrawable.addState(arr, colorDrawable);
                stateDrawable.setBounds(0, 15, viewGroup.getRight(), viewGroup.getBottom());
                viewGroup.setBackground(stateDrawable);
            }
        }
        else {
            const backgroundDrawable = tryCloneDrawable(value, nativeView.getResources());
            viewGroup.setBackground(backgroundDrawable);
        }
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
export class SegmentedBar extends SegmentedBarBase {
    shouldChangeSelectedIndex() {
        return !this._addingTab;
    }
    createNativeView() {
        initializeNativeClasses();
        const context = this._context;
        const nativeView = new TabHost(context, null);
        const tabHostLayout = new android.widget.LinearLayout(context);
        tabHostLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        const tabWidget = new android.widget.TabWidget(context);
        tabWidget.setId(R_ID_TABS);
        tabHostLayout.addView(tabWidget);
        const frame = new android.widget.FrameLayout(context);
        frame.setId(R_ID_TABCONTENT);
        frame.setVisibility(android.view.View.GONE);
        tabHostLayout.addView(frame);
        nativeView.addView(tabHostLayout);
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        const listener = new TabChangeListener(this);
        nativeView.setOnTabChangedListener(listener);
        nativeView.listener = listener;
        nativeView.setup();
        this._tabContentFactory = this._tabContentFactory || new TabContentFactory(this);
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        nativeView.listener.owner = null;
        super.disposeNativeView();
    }
    onLoaded() {
        super.onLoaded();
        // Can only be applied after view is loaded
        const tabWidget = this.nativeViewProtected.getTabWidget();
        if (tabWidget) {
            tabWidget.setEnabled(tabWidget.isEnabled());
        }
    }
    insertTab(tabItem, index) {
        const tabHost = this.nativeViewProtected;
        const tab = tabHost.newTabSpec(index + '');
        tab.setIndicator(tabItem.title + '');
        tab.setContent(this._tabContentFactory);
        this._addingTab = true;
        tabHost.addTab(tab);
        tabItem.setupNativeView(index);
        this._addingTab = false;
    }
    [selectedIndexProperty.getDefault]() {
        return -1;
    }
    [selectedIndexProperty.setNative](value) {
        this.nativeViewProtected.setCurrentTab(value);
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        this.nativeViewProtected.clearAllTabs();
        const newItems = value;
        if (newItems) {
            newItems.forEach((item, i, arr) => this.insertTab(item, i));
        }
        selectedIndexProperty.coerce(this);
    }
    [isEnabledProperty.setNative](value) {
        const tabWidget = this.nativeViewProtected.getTabWidget();
        if (tabWidget) {
            tabWidget.setEnabled(value);
        }
    }
}
//# sourceMappingURL=index.android.js.map