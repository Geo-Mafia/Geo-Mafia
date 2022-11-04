import { StackLayoutBase, orientationProperty } from './stack-layout-common';
export * from './stack-layout-common';
export class StackLayout extends StackLayoutBase {
    createNativeView() {
        return new org.nativescript.widgets.StackLayout(this._context);
    }
    [orientationProperty.setNative](value) {
        this.nativeViewProtected.setOrientation(value === 'vertical' ? org.nativescript.widgets.Orientation.vertical : org.nativescript.widgets.Orientation.horizontal);
    }
}
//# sourceMappingURL=index.android.js.map