import { SliderBase, valueProperty, minValueProperty, maxValueProperty } from './slider-common';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty } from '../styling/style-properties';
import { Color } from '../../color';
export * from './slider-common';
let SeekBar;
let SeekBarChangeListener;
function initializeListenerClass() {
    if (!SeekBarChangeListener) {
        var SeekBarChangeListenerImpl = /** @class */ (function (_super) {
    __extends(SeekBarChangeListenerImpl, _super);
    function SeekBarChangeListenerImpl() {
        var _this = _super.call(this) || this;
        return global.__native(_this);
    }
    SeekBarChangeListenerImpl.prototype.onProgressChanged = function (seekBar, progress, fromUser) {
        var owner = seekBar.owner;
        if (owner && !owner._supressNativeValue) {
            var newValue = progress + owner.minValue;
            valueProperty.nativeValueChange(owner, newValue);
        }
    };
    SeekBarChangeListenerImpl.prototype.onStartTrackingTouch = function (seekBar) {
        //
    };
    SeekBarChangeListenerImpl.prototype.onStopTrackingTouch = function (seekBar) {
        //
    };
    SeekBarChangeListenerImpl = __decorate([
        Interfaces([android.widget.SeekBar.OnSeekBarChangeListener])
    ], SeekBarChangeListenerImpl);
    return SeekBarChangeListenerImpl;
}(java.lang.Object));
        SeekBarChangeListener = new SeekBarChangeListenerImpl();
    }
}
function getListener() {
    return SeekBarChangeListener;
}
export class Slider extends SliderBase {
    createNativeView() {
        if (!SeekBar) {
            SeekBar = android.widget.SeekBar;
        }
        return new SeekBar(this._context);
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        nativeView.owner = this;
        initializeListenerClass();
        const listener = getListener();
        nativeView.setOnSeekBarChangeListener(listener);
    }
    disposeNativeView() {
        this.nativeViewProtected.owner = null;
        super.disposeNativeView();
    }
    resetNativeView() {
        super.resetNativeView();
        const nativeView = this.nativeViewProtected;
        nativeView.setMax(100);
        nativeView.setProgress(0);
        nativeView.setKeyProgressIncrement(1);
    }
    /**
     * There is no minValue in Android. We simulate this by subtracting the minValue from the native value and maxValue.
     * We need this method to call native setMax and setProgress methods when minValue property is changed,
     * without handling the native value changed callback.
     */
    setNativeValuesSilently() {
        this._supressNativeValue = true;
        const nativeView = this.nativeViewProtected;
        try {
            nativeView.setMax(this.maxValue - this.minValue);
            nativeView.setProgress(this.value - this.minValue);
        }
        finally {
            this._supressNativeValue = false;
        }
    }
    [valueProperty.setNative](value) {
        this.setNativeValuesSilently();
    }
    [minValueProperty.setNative](value) {
        this.setNativeValuesSilently();
    }
    [maxValueProperty.getDefault]() {
        return 100;
    }
    [maxValueProperty.setNative](value) {
        this.setNativeValuesSilently();
    }
    [colorProperty.getDefault]() {
        return -1;
    }
    [colorProperty.setNative](value) {
        if (value instanceof Color) {
            this.nativeViewProtected.getThumb().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeViewProtected.getThumb().clearColorFilter();
        }
    }
    [backgroundColorProperty.getDefault]() {
        return -1;
    }
    [backgroundColorProperty.setNative](value) {
        if (value instanceof Color) {
            this.nativeViewProtected.getProgressDrawable().setColorFilter(value.android, android.graphics.PorterDuff.Mode.SRC_IN);
        }
        else {
            this.nativeViewProtected.getProgressDrawable().clearColorFilter();
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