import { ScrollViewBase, scrollBarIndicatorVisibleProperty, isScrollEnabledProperty } from './scroll-view-common';
import { iOSNativeHelper, layout } from '../../utils';
import { View } from '../core/view';
export * from './scroll-view-common';
const majorVersion = iOSNativeHelper.MajorVersion;
var UIScrollViewDelegateImpl = /** @class */ (function (_super) {
    __extends(UIScrollViewDelegateImpl, _super);
    function UIScrollViewDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIScrollViewDelegateImpl.initWithOwner = function (owner) {
        var impl = UIScrollViewDelegateImpl.new();
        impl._owner = owner;
        return impl;
    };
    UIScrollViewDelegateImpl.prototype.scrollViewDidScroll = function (sv) {
        var owner = this._owner.get();
        if (owner) {
            owner.notify({
                object: owner,
                eventName: 'scroll',
                scrollX: owner.horizontalOffset,
                scrollY: owner.verticalOffset,
            });
        }
    };
    UIScrollViewDelegateImpl.ObjCProtocols = [UIScrollViewDelegate];
    return UIScrollViewDelegateImpl;
}(NSObject));
export class ScrollView extends ScrollViewBase {
    constructor() {
        super(...arguments);
        this._contentMeasuredWidth = 0;
        this._contentMeasuredHeight = 0;
    }
    createNativeView() {
        const view = UIScrollView.new();
        return view;
    }
    initNativeView() {
        super.initNativeView();
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
        this._setNativeClipToBounds();
    }
    _setNativeClipToBounds() {
        // Always set clipsToBounds for scroll-view
        this.nativeViewProtected.clipsToBounds = true;
    }
    attachNative() {
        this._delegate = UIScrollViewDelegateImpl.initWithOwner(new WeakRef(this));
        this.nativeViewProtected.delegate = this._delegate;
    }
    dettachNative() {
        this.nativeViewProtected.delegate = null;
    }
    updateScrollBarVisibility(value) {
        if (!this.nativeViewProtected) {
            return;
        }
        if (this.orientation === 'horizontal') {
            this.nativeViewProtected.showsHorizontalScrollIndicator = value;
        }
        else {
            this.nativeViewProtected.showsVerticalScrollIndicator = value;
        }
    }
    get horizontalOffset() {
        return this.nativeViewProtected ? this.nativeViewProtected.contentOffset.x : 0;
    }
    get verticalOffset() {
        return this.nativeViewProtected ? this.nativeViewProtected.contentOffset.y : 0;
    }
    get scrollableWidth() {
        if (!this.nativeViewProtected || this.orientation !== 'horizontal') {
            return 0;
        }
        return Math.max(0, this.nativeViewProtected.contentSize.width - this.nativeViewProtected.bounds.size.width);
    }
    get scrollableHeight() {
        if (!this.nativeViewProtected || this.orientation !== 'vertical') {
            return 0;
        }
        return Math.max(0, this.nativeViewProtected.contentSize.height - this.nativeViewProtected.bounds.size.height);
    }
    [isScrollEnabledProperty.getDefault]() {
        return this.nativeViewProtected.scrollEnabled;
    }
    [isScrollEnabledProperty.setNative](value) {
        this.nativeViewProtected.scrollEnabled = value;
    }
    [scrollBarIndicatorVisibleProperty.getDefault]() {
        return true;
    }
    [scrollBarIndicatorVisibleProperty.setNative](value) {
        this.updateScrollBarVisibility(value);
    }
    scrollToVerticalOffset(value, animated) {
        if (this.nativeViewProtected && this.orientation === 'vertical' && this.isScrollEnabled) {
            const bounds = this.nativeViewProtected.bounds.size;
            this.nativeViewProtected.scrollRectToVisibleAnimated(CGRectMake(0, value, bounds.width, bounds.height), animated);
        }
    }
    scrollToHorizontalOffset(value, animated) {
        if (this.nativeViewProtected && this.orientation === 'horizontal' && this.isScrollEnabled) {
            const bounds = this.nativeViewProtected.bounds.size;
            this.nativeViewProtected.scrollRectToVisibleAnimated(CGRectMake(value, 0, bounds.width, bounds.height), animated);
        }
    }
    onMeasure(widthMeasureSpec, heightMeasureSpec) {
        // Don't call measure because it will measure content twice.
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);
        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        const child = this.layoutView;
        this._contentMeasuredWidth = this.effectiveMinWidth;
        this._contentMeasuredHeight = this.effectiveMinHeight;
        if (child) {
            let childSize;
            if (this.orientation === 'vertical') {
                childSize = View.measureChild(this, child, widthMeasureSpec, layout.makeMeasureSpec(0, layout.UNSPECIFIED));
            }
            else {
                childSize = View.measureChild(this, child, layout.makeMeasureSpec(0, layout.UNSPECIFIED), heightMeasureSpec);
            }
            this._contentMeasuredWidth = Math.max(childSize.measuredWidth, this.effectiveMinWidth);
            this._contentMeasuredHeight = Math.max(childSize.measuredHeight, this.effectiveMinHeight);
        }
        const widthAndState = View.resolveSizeAndState(this._contentMeasuredWidth, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(this._contentMeasuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    }
    onLayout(left, top, right, bottom) {
        const insets = this.getSafeAreaInsets();
        let width = right - left - insets.right - insets.left;
        let height = bottom - top - insets.bottom - insets.top;
        const nativeView = this.nativeViewProtected;
        if (majorVersion > 10) {
            // Disable automatic adjustment of scroll view insets
            // Consider exposing this as property with all 4 modes
            // https://developer.apple.com/documentation/uikit/uiscrollview/contentinsetadjustmentbehavior
            nativeView.contentInsetAdjustmentBehavior = 2;
        }
        let scrollWidth = width + insets.left + insets.right;
        let scrollHeight = height + insets.top + insets.bottom;
        if (this.orientation === 'horizontal') {
            scrollWidth = Math.max(this._contentMeasuredWidth + insets.left + insets.right, scrollWidth);
            width = Math.max(this._contentMeasuredWidth, width);
        }
        else {
            scrollHeight = Math.max(this._contentMeasuredHeight + insets.top + insets.bottom, scrollHeight);
            height = Math.max(this._contentMeasuredHeight, height);
        }
        nativeView.contentSize = CGSizeMake(layout.toDeviceIndependentPixels(scrollWidth), layout.toDeviceIndependentPixels(scrollHeight));
        View.layoutChild(this, this.layoutView, insets.left, insets.top, insets.left + width, insets.top + height);
    }
    _onOrientationChanged() {
        this.updateScrollBarVisibility(this.scrollBarIndicatorVisible);
    }
}
ScrollView.prototype.recycleNativeView = 'auto';
//# sourceMappingURL=index.ios.js.map