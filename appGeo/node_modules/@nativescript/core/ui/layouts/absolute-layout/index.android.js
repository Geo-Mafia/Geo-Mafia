import { AbsoluteLayoutBase, leftProperty, topProperty } from './absolute-layout-common';
import { View } from '../../core/view';
import { Length } from '../../styling/style-properties';
export * from './absolute-layout-common';
function makeNativeSetter(setter) {
    return function (value) {
        const nativeView = this.nativeViewProtected;
        const lp = nativeView.getLayoutParams() || new org.nativescript.widgets.CommonLayoutParams();
        if (lp instanceof org.nativescript.widgets.CommonLayoutParams) {
            setter.call(this, lp, value);
            nativeView.setLayoutParams(lp);
        }
    };
}
View.prototype[topProperty.setNative] = makeNativeSetter(function (lp, value) {
    lp.top = Length.toDevicePixels(value, 0);
});
View.prototype[leftProperty.setNative] = makeNativeSetter(function (lp, value) {
    lp.left = Length.toDevicePixels(value, 0);
});
export class AbsoluteLayout extends AbsoluteLayoutBase {
    createNativeView() {
        return new org.nativescript.widgets.AbsoluteLayout(this._context);
    }
}
//# sourceMappingURL=index.android.js.map