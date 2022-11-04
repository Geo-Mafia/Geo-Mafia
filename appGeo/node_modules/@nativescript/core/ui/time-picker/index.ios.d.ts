import { TimePickerBase } from './time-picker-common';
export * from './time-picker-common';
export declare class TimePicker extends TimePickerBase {
    nativeViewProtected: UIDatePicker;
    private _changeHandler;
    constructor();
    createNativeView(): UIDatePicker;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UIDatePicker;
}
