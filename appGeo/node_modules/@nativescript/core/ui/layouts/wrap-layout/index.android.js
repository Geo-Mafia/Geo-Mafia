import { WrapLayoutBase, orientationProperty, itemWidthProperty, itemHeightProperty } from './wrap-layout-common';
import { Length } from '../../styling/style-properties';
export * from './wrap-layout-common';
export class WrapLayout extends WrapLayoutBase {
    createNativeView() {
        return new org.nativescript.widgets.WrapLayout(this._context);
    }
    [orientationProperty.setNative](value) {
        this.nativeViewProtected.setOrientation(value === 'vertical' ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
    }
    [itemWidthProperty.setNative](value) {
        this.nativeViewProtected.setItemWidth(Length.toDevicePixels(value, -1));
    }
    [itemHeightProperty.setNative](value) {
        this.nativeViewProtected.setItemHeight(Length.toDevicePixels(value, -1));
    }
}
//# sourceMappingURL=index.android.js.map