import { DatePickerBase } from './date-picker-common';
import { TimePicker } from '../time-picker';
export * from './date-picker-common';
export declare class DatePicker extends DatePickerBase {
    nativeViewProtected: android.widget.DatePicker;
    timePicker: TimePicker;
    createNativeView(): globalAndroid.widget.DatePicker;
    initNativeView(): void;
    disposeNativeView(): void;
    private updateNativeDate;
}
