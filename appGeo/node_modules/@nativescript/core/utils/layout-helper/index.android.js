import { MODE_MASK } from './layout-helper-common';
import { ad } from '../native-helper';
export * from './layout-helper-common';
let density;
let sdkVersion;
let useOldMeasureSpec = false;
export function makeMeasureSpec(size, mode) {
    if (sdkVersion === undefined) {
        // check whether the old layout is needed
        sdkVersion = ad.getApplicationContext().getApplicationInfo().targetSdkVersion;
        useOldMeasureSpec = sdkVersion <= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
    }
    if (useOldMeasureSpec) {
        return size + mode;
    }
    return (size & ~MODE_MASK) | (mode & MODE_MASK);
}
export function getDisplayDensity() {
    if (density === undefined) {
        density = ad.getResources().getDisplayMetrics().density;
    }
    return density;
}
export function toDevicePixels(value) {
    return value * getDisplayDensity();
}
export function toDeviceIndependentPixels(value) {
    return value / getDisplayDensity();
}
export function measureNativeView(nativeView /* android.view.View */, width, widthMode, height, heightMode) {
    const view = nativeView;
    view.measure(makeMeasureSpec(width, widthMode), makeMeasureSpec(height, heightMode));
    return {
        width: view.getMeasuredWidth(),
        height: view.getMeasuredHeight(),
    };
}
//# sourceMappingURL=index.android.js.map