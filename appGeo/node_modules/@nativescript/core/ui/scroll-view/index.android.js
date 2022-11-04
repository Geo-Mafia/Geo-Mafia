import { ScrollViewBase, scrollBarIndicatorVisibleProperty, isScrollEnabledProperty } from './scroll-view-common';
import { layout } from '../../utils';
import { isUserInteractionEnabledProperty } from '../core/view';
export * from './scroll-view-common';
export class ScrollView extends ScrollViewBase {
    constructor() {
        super(...arguments);
        this._androidViewId = -1;
        this._lastScrollX = -1;
        this._lastScrollY = -1;
    }
    get horizontalOffset() {
        const nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return 0;
        }
        return nativeView.getScrollX() / layout.getDisplayDensity();
    }
    get verticalOffset() {
        const nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return 0;
        }
        return nativeView.getScrollY() / layout.getDisplayDensity();
    }
    get scrollableWidth() {
        const nativeView = this.nativeViewProtected;
        if (!nativeView || this.orientation !== 'horizontal') {
            return 0;
        }
        return nativeView.getScrollableLength() / layout.getDisplayDensity();
    }
    get scrollableHeight() {
        const nativeView = this.nativeViewProtected;
        if (!nativeView || this.orientation !== 'vertical') {
            return 0;
        }
        return nativeView.getScrollableLength() / layout.getDisplayDensity();
    }
    [isUserInteractionEnabledProperty.setNative](value) {
        // NOTE: different behavior on iOS & Android:
        // iOS disables user interaction recursively for all subviews as well
        this.nativeViewProtected.setClickable(value);
        this.nativeViewProtected.setFocusable(value);
        this.nativeViewProtected.setScrollEnabled(value);
    }
    [isScrollEnabledProperty.getDefault]() {
        return this.nativeViewProtected.getScrollEnabled();
    }
    [isScrollEnabledProperty.setNative](value) {
        this.nativeViewProtected.setScrollEnabled(value);
    }
    [scrollBarIndicatorVisibleProperty.getDefault]() {
        return true;
    }
    [scrollBarIndicatorVisibleProperty.setNative](value) {
        if (this.orientation === 'horizontal') {
            this.nativeViewProtected.setHorizontalScrollBarEnabled(value);
        }
        else {
            this.nativeViewProtected.setVerticalScrollBarEnabled(value);
        }
    }
    scrollToVerticalOffset(value, animated) {
        const nativeView = this.nativeViewProtected;
        if (nativeView && this.orientation === 'vertical' && this.isScrollEnabled) {
            value *= layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(0, value);
            }
            else {
                nativeView.scrollTo(0, value);
            }
        }
    }
    scrollToHorizontalOffset(value, animated) {
        const nativeView = this.nativeViewProtected;
        if (nativeView && this.orientation === 'horizontal' && this.isScrollEnabled) {
            value *= layout.getDisplayDensity();
            if (animated) {
                nativeView.smoothScrollTo(value, 0);
            }
            else {
                nativeView.scrollTo(value, 0);
            }
        }
    }
    createNativeView() {
        return this.orientation === 'horizontal' ? new org.nativescript.widgets.HorizontalScrollView(this._context) : new org.nativescript.widgets.VerticalScrollView(this._context);
    }
    initNativeView() {
        super.initNativeView();
        if (this._androidViewId < 0) {
            this._androidViewId = android.view.View.generateViewId();
        }
        this.nativeViewProtected.setId(this._androidViewId);
    }
    _onOrientationChanged() {
        if (this.nativeViewProtected) {
            const parent = this.parent;
            if (parent) {
                parent._removeView(this);
                parent._addView(this);
            }
        }
    }
    attachNative() {
        const that = new WeakRef(this);
        this.handler = new android.view.ViewTreeObserver.OnScrollChangedListener({
            onScrollChanged: function () {
                const owner = that.get();
                if (owner) {
                    owner._onScrollChanged();
                }
            },
        });
        this.nativeViewProtected.getViewTreeObserver().addOnScrollChangedListener(this.handler);
    }
    _onScrollChanged() {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            // Event is only raised if the scroll values differ from the last time in order to wokraround a native Android bug.
            // https://github.com/NativeScript/NativeScript/issues/2362
            const newScrollX = nativeView.getScrollX();
            const newScrollY = nativeView.getScrollY();
            if (newScrollX !== this._lastScrollX || newScrollY !== this._lastScrollY) {
                this.notify({
                    object: this,
                    eventName: ScrollView.scrollEvent,
                    scrollX: newScrollX / layout.getDisplayDensity(),
                    scrollY: newScrollY / layout.getDisplayDensity(),
                });
                this._lastScrollX = newScrollX;
                this._lastScrollY = newScrollY;
            }
        }
    }
    dettachNative() {
        var _a;
        (_a = this.nativeViewProtected) === null || _a === void 0 ? void 0 : _a.getViewTreeObserver().removeOnScrollChangedListener(this.handler);
        this.handler = null;
    }
}
ScrollView.prototype.recycleNativeView = 'never';
//# sourceMappingURL=index.android.js.map