import { ProgressBase, valueProperty, maxValueProperty } from './progress-common';
import { Color } from '../../color';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty } from '../styling/style-properties';
export * from './progress-common';
const R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL = 0x01010078;
export class Progress extends ProgressBase {
    createNativeView() {
        return new android.widget.ProgressBar(this._context, null, R_ATTR_PROGRESS_BAR_STYLE_HORIZONTAL);
    }
    [valueProperty.getDefault]() {
        return 0;
    }
    [valueProperty.setNative](value) {
        this.nativeViewProtected.setProgress(value);
    }
    [maxValueProperty.getDefault]() {
        return 100;
    }
    [maxValueProperty.setNative](value) {
        this.nativeViewProtected.setMax(value);
    }
    [colorProperty.getDefault]() {
        return null;
    }
    [colorProperty.setNative](value) {
        const progressDrawable = this.nativeViewProtected.getProgressDrawable();
        if (!progressDrawable) {
            return;
        }
        if (value instanceof Color) {
            progressDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            progressDrawable.clearColorFilter();
        }
    }
    [backgroundColorProperty.getDefault]() {
        return null;
    }
    [backgroundColorProperty.setNative](value) {
        const progressDrawable = this.nativeViewProtected.getProgressDrawable();
        if (!progressDrawable) {
            return;
        }
        if (progressDrawable instanceof android.graphics.drawable.LayerDrawable && progressDrawable.getNumberOfLayers() > 0) {
            const backgroundDrawable = progressDrawable.getDrawable(0);
            if (backgroundDrawable) {
                if (value instanceof Color) {
                    backgroundDrawable.setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
                }
                else {
                    backgroundDrawable.clearColorFilter();
                }
            }
        }
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        //
    }
}
//# sourceMappingURL=index.android.js.map