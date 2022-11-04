import { ProgressBase, valueProperty, maxValueProperty } from './progress-common';
import { Color } from '../../color';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty } from '../styling/style-properties';
export * from './progress-common';
export class Progress extends ProgressBase {
    createNativeView() {
        return UIProgressView.new();
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    [valueProperty.getDefault]() {
        return 0;
    }
    [valueProperty.setNative](value) {
        this.ios.progress = value / this.maxValue;
    }
    [maxValueProperty.getDefault]() {
        return 100;
    }
    [maxValueProperty.setNative](value) {
        this.ios.progress = this.value / value;
    }
    [colorProperty.getDefault]() {
        return this.ios.progressTintColor;
    }
    [colorProperty.setNative](value) {
        this.ios.progressTintColor = value instanceof Color ? value.ios : value;
    }
    [backgroundColorProperty.getDefault]() {
        return this.ios.trackTintColor;
    }
    [backgroundColorProperty.setNative](value) {
        const color = value instanceof Color ? value.ios : value;
        this.ios.trackTintColor = color;
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        //
    }
}
//# sourceMappingURL=index.ios.js.map