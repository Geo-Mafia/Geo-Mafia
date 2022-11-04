import { DatePicker as DatePickerDefinition } from '.';
import { View } from '../core/view';
import { Property } from '../core/properties';
export declare class DatePickerBase extends View implements DatePickerDefinition {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    maxDate: Date;
    minDate: Date;
    date: Date;
    iosPreferredDatePickerStyle: number;
    showTime: boolean;
}
export declare const yearProperty: Property<DatePickerBase, number>;
export declare const monthProperty: Property<DatePickerBase, number>;
export declare const dayProperty: Property<DatePickerBase, number>;
export declare const hourProperty: Property<DatePickerBase, number>;
export declare const minuteProperty: Property<DatePickerBase, number>;
export declare const secondProperty: Property<DatePickerBase, number>;
export declare const maxDateProperty: Property<DatePickerBase, Date>;
export declare const minDateProperty: Property<DatePickerBase, Date>;
export declare const dateProperty: Property<DatePickerBase, Date>;
export declare const showTimeProperty: Property<DatePickerBase, boolean>;
export declare const iosPreferredDatePickerStyleProperty: Property<DatePickerBase, number>;
