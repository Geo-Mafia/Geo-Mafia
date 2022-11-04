import { ListPickerBase } from './list-picker-common';
export * from './list-picker-common';
export declare class ListPicker extends ListPickerBase {
    nativeViewProtected: android.widget.NumberPicker;
    private _selectorWheelPaint;
    createNativeView(): globalAndroid.widget.NumberPicker;
    initNativeView(): void;
    disposeNativeView(): void;
    private _fixNumberPickerRendering;
}
