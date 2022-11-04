import { ActivityIndicatorBase, busyProperty } from './activity-indicator-common';
import { CoreTypes } from '../../core-types';
import { Color } from '../../color';
import { colorProperty, visibilityProperty } from '../styling/style-properties';
export * from './activity-indicator-common';
export class ActivityIndicator extends ActivityIndicatorBase {
    createNativeView() {
        const progressBar = new android.widget.ProgressBar(this._context);
        progressBar.setVisibility(android.view.View.INVISIBLE);
        progressBar.setIndeterminate(true);
        return progressBar;
    }
    [busyProperty.getDefault]() {
        return false;
    }
    [busyProperty.setNative](value) {
        if (this.visibility === CoreTypes.Visibility.visible) {
            this.nativeViewProtected.setVisibility(value ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
        }
    }
    [visibilityProperty.getDefault]() {
        return CoreTypes.Visibility.hidden;
    }
    [visibilityProperty.setNative](value) {
        switch (value) {
            case CoreTypes.Visibility.visible:
                this.nativeViewProtected.setVisibility(this.busy ? android.view.View.VISIBLE : android.view.View.INVISIBLE);
                break;
            case CoreTypes.Visibility.hidden:
                this.nativeViewProtected.setVisibility(android.view.View.INVISIBLE);
                break;
            case CoreTypes.Visibility.collapse:
                this.nativeViewProtected.setVisibility(android.view.View.GONE);
                break;
            default:
                throw new Error(`Invalid visibility value: ${value}. Valid values are: "${CoreTypes.Visibility.visible}", "${CoreTypes.Visibility.hidden}", "${CoreTypes.Visibility.collapse}".`);
        }
    }
    [colorProperty.getDefault]() {
        return -1;
    }
    [colorProperty.setNative](value) {
        const color = value instanceof Color ? value.android : value;
        const drawable = this.nativeViewProtected.getIndeterminateDrawable().mutate();
        if (color) {
            drawable.setColorFilter(color, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            drawable.clearColorFilter();
        }
    }
}
//# sourceMappingURL=index.android.js.map