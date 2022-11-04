import { SliderBase } from './slider-common';
export * from './slider-common';
interface OwnerSeekBar extends android.widget.SeekBar {
    owner: Slider;
}
export declare class Slider extends SliderBase {
    _supressNativeValue: boolean;
    nativeViewProtected: OwnerSeekBar;
    createNativeView(): globalAndroid.widget.SeekBar;
    initNativeView(): void;
    disposeNativeView(): void;
    resetNativeView(): void;
    /**
     * There is no minValue in Android. We simulate this by subtracting the minValue from the native value and maxValue.
     * We need this method to call native setMax and setProgress methods when minValue property is changed,
     * without handling the native value changed callback.
     */
    private setNativeValuesSilently;
}
