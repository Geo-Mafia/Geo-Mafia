import { TimePicker as TimePickerDefinition } from '.';
import { View } from '../core/view';
import { Property } from '../core/properties';
interface Time {
    hour: number;
    minute: number;
}
export declare function getValidTime(picker: TimePickerDefinition, hour: number, minute: number): Time;
export declare function isDefined(value: any): boolean;
export declare abstract class TimePickerBase extends View implements TimePickerDefinition {
    hour: number;
    minute: number;
    time: Date;
    minuteInterval: number;
    minHour: number;
    maxHour: number;
    minMinute: number;
    maxMinute: number;
    iosPreferredDatePickerStyle: number;
}
export declare const minHourProperty: Property<TimePickerBase, number>;
export declare const maxHourProperty: Property<TimePickerBase, number>;
export declare const minMinuteProperty: Property<TimePickerBase, number>;
export declare const maxMinuteProperty: Property<TimePickerBase, number>;
export declare const minuteIntervalProperty: Property<TimePickerBase, number>;
export declare const minuteProperty: Property<TimePickerBase, number>;
export declare const hourProperty: Property<TimePickerBase, number>;
export declare const timeProperty: Property<TimePickerBase, Date>;
export declare const iosPreferredDatePickerStyleProperty: Property<TimePickerBase, number>;
export {};
