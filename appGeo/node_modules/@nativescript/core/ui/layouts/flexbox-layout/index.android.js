import { FlexDirection, FlexWrap, JustifyContent, AlignItems, AlignContent, FlexboxLayoutBase, orderProperty, flexGrowProperty, flexShrinkProperty, flexWrapBeforeProperty, alignSelfProperty, AlignSelf, flexDirectionProperty, flexWrapProperty, justifyContentProperty, alignItemsProperty, alignContentProperty } from './flexbox-layout-common';
import { View } from '../../core/view';
import { Length } from '../../styling/style-properties';
export * from './flexbox-layout-common';
let widgetFlexboxLayout;
let widgetLayoutParams;
function ensureNativeTypes() {
    if (!widgetFlexboxLayout) {
        widgetFlexboxLayout = org.nativescript.widgets.FlexboxLayout;
        widgetLayoutParams = widgetFlexboxLayout.LayoutParams;
    }
}
function makeNativeSetter(setter) {
    return function (value) {
        ensureNativeTypes();
        const nativeView = this.nativeViewProtected;
        const lp = nativeView.getLayoutParams() || new widgetLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            setter(lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
View.prototype[orderProperty.setNative] = makeNativeSetter((lp, value) => (lp.order = value));
View.prototype[flexGrowProperty.setNative] = makeNativeSetter((lp, value) => (lp.flexGrow = value));
View.prototype[flexShrinkProperty.setNative] = makeNativeSetter((lp, value) => (lp.flexShrink = value));
View.prototype[flexWrapBeforeProperty.setNative] = makeNativeSetter((lp, value) => (lp.wrapBefore = value));
View.prototype[alignSelfProperty.setNative] = makeNativeSetter((lp, value) => (lp.alignSelf = alignSelfMap[value]));
const flexDirectionMap = {
    [FlexDirection.ROW]: 0,
    [FlexDirection.ROW_REVERSE]: 1,
    [FlexDirection.COLUMN]: 2,
    [FlexDirection.COLUMN_REVERSE]: 3, //FlexboxLayoutWidget.FLEX_DIRECTION_COLUMN_REVERSE
};
const flexWrapMap = {
    [FlexWrap.NOWRAP]: 0,
    [FlexWrap.WRAP]: 1,
    [FlexWrap.WRAP_REVERSE]: 2, //FlexboxLayoutWidget.FLEX_WRAP_WRAP_REVERSE
};
const justifyContentMap = {
    [JustifyContent.FLEX_START]: 0,
    [JustifyContent.FLEX_END]: 1,
    [JustifyContent.CENTER]: 2,
    [JustifyContent.SPACE_BETWEEN]: 3,
    [JustifyContent.SPACE_AROUND]: 4, //FlexboxLayoutWidget.JUSTIFY_CONTENT_SPACE_AROUND,
};
const alignItemsMap = {
    [AlignItems.FLEX_START]: 0,
    [AlignItems.FLEX_END]: 1,
    [AlignItems.CENTER]: 2,
    [AlignItems.BASELINE]: 3,
    [AlignItems.STRETCH]: 4, //FlexboxLayoutWidget.ALIGN_ITEMS_STRETCH
};
const alignContentMap = {
    [AlignContent.FLEX_START]: 0,
    [AlignContent.FLEX_END]: 1,
    [AlignContent.CENTER]: 2,
    [AlignContent.SPACE_BETWEEN]: 3,
    [AlignContent.SPACE_AROUND]: 4,
    [AlignContent.STRETCH]: 5, //FlexboxLayoutWidget.ALIGN_CONTENT_STRETCH
};
const alignSelfMap = {
    [AlignSelf.AUTO]: -1,
    [AlignSelf.FLEX_START]: 0,
    [AlignSelf.FLEX_END]: 1,
    [AlignSelf.CENTER]: 2,
    [AlignSelf.BASELINE]: 3,
    [AlignSelf.STRETCH]: 4, //FlexboxLayoutWidget.LayoutParams.ALIGN_SELF_STRETCH
};
export class FlexboxLayout extends FlexboxLayoutBase {
    constructor() {
        super();
        ensureNativeTypes();
    }
    createNativeView() {
        return new widgetFlexboxLayout(this._context);
    }
    resetNativeView() {
        super.resetNativeView();
        this.nativeViewProtected.invalidateOrdersCache();
    }
    [flexDirectionProperty.getDefault]() {
        return flexDirectionProperty.defaultValue;
    }
    [flexDirectionProperty.setNative](flexDirection) {
        this.nativeViewProtected.setFlexDirection(flexDirectionMap[flexDirection]);
    }
    [flexWrapProperty.getDefault]() {
        return flexWrapProperty.defaultValue;
    }
    [flexWrapProperty.setNative](flexWrap) {
        this.nativeViewProtected.setFlexWrap(flexWrapMap[flexWrap]);
    }
    [justifyContentProperty.getDefault]() {
        return justifyContentProperty.defaultValue;
    }
    [justifyContentProperty.setNative](justifyContent) {
        this.nativeViewProtected.setJustifyContent(justifyContentMap[justifyContent]);
    }
    [alignItemsProperty.getDefault]() {
        return alignItemsProperty.defaultValue;
    }
    [alignItemsProperty.setNative](alignItems) {
        this.nativeViewProtected.setAlignItems(alignItemsMap[alignItems]);
    }
    [alignContentProperty.getDefault]() {
        return alignContentProperty.defaultValue;
    }
    [alignContentProperty.setNative](alignContent) {
        this.nativeViewProtected.setAlignContent(alignContentMap[alignContent]);
    }
    _updateNativeLayoutParams(child) {
        super._updateNativeLayoutParams(child);
        // NOTE: If minWidth/Height is not set, the next code will clear the default native values for minWidth/Height.
        // Flex box will not respect the button default min width. Keeping this behavior for back-compatibility.
        this._setChildMinWidthNative(child, child.minWidth);
        this._setChildMinHeightNative(child, child.minHeight);
        const lp = child.nativeViewProtected.getLayoutParams();
        const style = child.style;
        lp.order = style.order;
        lp.flexGrow = style.flexGrow;
        lp.flexShrink = style.flexShrink;
        lp.wrapBefore = style.flexWrapBefore;
        lp.alignSelf = alignSelfMap[style.alignSelf];
        child.nativeViewProtected.setLayoutParams(lp);
    }
    _setChildMinWidthNative(child, value) {
        // Check needed to maintain back-compat after https://github.com/NativeScript/NativeScript/pull/7804
        if (!child._ignoreFlexMinWidthHeightReset) {
            child._setMinWidthNative(0);
        }
        const nativeView = child.nativeViewProtected;
        const lp = nativeView.getLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            lp.minWidth = Length.toDevicePixels(value, 0);
            nativeView.setLayoutParams(lp);
        }
    }
    _setChildMinHeightNative(child, value) {
        // Check needed to maintain back-compat after https://github.com/NativeScript/NativeScript/pull/7804
        if (!child._ignoreFlexMinWidthHeightReset) {
            child._setMinHeightNative(0);
        }
        const nativeView = child.nativeViewProtected;
        const lp = nativeView.getLayoutParams();
        if (lp instanceof widgetLayoutParams) {
            lp.minHeight = Length.toDevicePixels(value, 0);
            nativeView.setLayoutParams(lp);
        }
    }
}
//# sourceMappingURL=index.android.js.map