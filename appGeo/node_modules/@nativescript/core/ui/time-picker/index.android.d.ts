import { TimePickerBase } from './time-picker-common';
export * from './time-picker-common';
export declare class TimePicker extends TimePickerBase {
    nativeViewProtected: android.widget.TimePicker;
    updatingNativeValue: boolean;
    createNativeView(): globalAndroid.widget.TimePicker;
    initNativeView(): void;
}
