import { DatePickerBase } from './date-picker-common';
export * from './date-picker-common';
export declare class DatePicker extends DatePickerBase {
    private _changeHandler;
    nativeViewProtected: UIDatePicker;
    createNativeView(): UIDatePicker;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UIDatePicker;
}
