import { round, MODE_MASK } from './layout-helper-common';
export * from './layout-helper-common';
export function makeMeasureSpec(size, mode) {
    return (Math.round(Math.max(0, size)) & ~MODE_MASK) | (mode & MODE_MASK);
}
export function getDisplayDensity() {
    return UIScreen.mainScreen.scale;
}
export function toDevicePixels(value) {
    return value * UIScreen.mainScreen.scale;
}
export function toDeviceIndependentPixels(value) {
    return value / UIScreen.mainScreen.scale;
}
export function measureNativeView(nativeView /* UIView */, width, widthMode, height, heightMode) {
    const view = nativeView;
    const nativeSize = view.sizeThatFits({
        width: widthMode === 0 /* layout.UNSPECIFIED */ ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(width),
        height: heightMode === 0 /* layout.UNSPECIFIED */ ? Number.POSITIVE_INFINITY : toDeviceIndependentPixels(height),
    });
    nativeSize.width = round(toDevicePixels(nativeSize.width));
    nativeSize.height = round(toDevicePixels(nativeSize.height));
    return nativeSize;
}
//# sourceMappingURL=index.ios.js.map