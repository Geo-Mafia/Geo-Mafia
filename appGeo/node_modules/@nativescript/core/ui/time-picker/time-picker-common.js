import { View, CSSType } from '../core/view';
import { Property } from '../core/properties';
const dateComparer = (x, y) => x <= y && x >= y;
export function getValidTime(picker, hour, minute) {
    if (picker.minuteInterval > 1) {
        const minuteFloor = minute - (minute % picker.minuteInterval);
        minute = minuteFloor + (minute === minuteFloor + 1 ? picker.minuteInterval : 0);
        if (minute === 60) {
            hour++;
            minute = 0;
        }
    }
    let time = { hour: hour, minute: minute };
    if (!isLessThanMaxTime(picker, hour, minute)) {
        time = { hour: picker.maxHour, minute: picker.maxMinute };
    }
    if (!isGreaterThanMinTime(picker, hour, minute)) {
        time = { hour: picker.minHour, minute: picker.minMinute };
    }
    return time;
}
function isValidTime(picker) {
    return isGreaterThanMinTime(picker) && isLessThanMaxTime(picker);
}
function isHourValid(value) {
    return typeof value === 'number' && value >= 0 && value <= 23;
}
function isMinuteValid(value) {
    return typeof value === 'number' && value >= 0 && value <= 59;
}
function isMinuteIntervalValid(value) {
    return typeof value === 'number' && value >= 1 && value <= 30 && 60 % value === 0;
}
function getMinutes(hour) {
    return hour * 60;
}
export function isDefined(value) {
    return value !== undefined;
}
function isGreaterThanMinTime(picker, hour, minute) {
    if (picker.minHour === undefined || picker.minMinute === undefined) {
        return true;
    }
    return getMinutes(hour !== undefined ? hour : picker.hour) + (minute !== undefined ? minute : picker.minute) >= getMinutes(picker.minHour) + picker.minMinute;
}
function isLessThanMaxTime(picker, hour, minute) {
    if (!isDefined(picker.maxHour) || !isDefined(picker.maxMinute)) {
        return true;
    }
    return getMinutes(isDefined(hour) ? hour : picker.hour) + (isDefined(minute) ? minute : picker.minute) <= getMinutes(picker.maxHour) + picker.maxMinute;
}
function toString(value) {
    if (value instanceof Date) {
        return value + '';
    }
    return value < 10 ? `0${value}` : `${value}`;
}
function getMinMaxTimeErrorMessage(picker) {
    return `Min time: (${toString(picker.minHour)}:${toString(picker.minMinute)}), max time: (${toString(picker.maxHour)}:${toString(picker.maxMinute)})`;
}
function getErrorMessage(picker, propertyName, newValue) {
    return `${propertyName} property value (${toString(newValue)}:${toString(picker.minute)}) is not valid. ${getMinMaxTimeErrorMessage(picker)}.`;
}
let TimePickerBase = class TimePickerBase extends View {
};
TimePickerBase = __decorate([
    CSSType('TimePicker')
], TimePickerBase);
export { TimePickerBase };
TimePickerBase.prototype.recycleNativeView = 'auto';
export const minHourProperty = new Property({
    name: 'minHour',
    defaultValue: 0,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'minHour', newValue));
        }
    },
    valueConverter: (v) => parseInt(v),
});
minHourProperty.register(TimePickerBase);
export const maxHourProperty = new Property({
    name: 'maxHour',
    defaultValue: 23,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'maxHour', newValue));
        }
    },
    valueConverter: (v) => parseInt(v),
});
maxHourProperty.register(TimePickerBase);
export const minMinuteProperty = new Property({
    name: 'minMinute',
    defaultValue: 0,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'minMinute', newValue));
        }
    },
    valueConverter: (v) => parseInt(v),
});
minMinuteProperty.register(TimePickerBase);
export const maxMinuteProperty = new Property({
    name: 'maxMinute',
    defaultValue: 59,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'maxMinute', newValue));
        }
    },
    valueConverter: (v) => parseInt(v),
});
maxMinuteProperty.register(TimePickerBase);
export const minuteIntervalProperty = new Property({
    name: 'minuteInterval',
    defaultValue: 1,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isMinuteIntervalValid(newValue)) {
            throw new Error(getErrorMessage(picker, 'minuteInterval', newValue));
        }
    },
    valueConverter: (v) => parseInt(v),
});
minuteIntervalProperty.register(TimePickerBase);
export const minuteProperty = new Property({
    name: 'minute',
    defaultValue: 0,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isMinuteValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'minute', newValue));
        }
        picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
    },
    valueConverter: (v) => parseInt(v),
});
minuteProperty.register(TimePickerBase);
export const hourProperty = new Property({
    name: 'hour',
    defaultValue: 0,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isHourValid(newValue) || !isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'Hour', newValue));
        }
        picker.time = new Date(0, 0, 0, picker.hour, picker.minute);
    },
    valueConverter: (v) => parseInt(v),
});
hourProperty.register(TimePickerBase);
export const timeProperty = new Property({
    name: 'time',
    defaultValue: new Date(),
    equalityComparer: dateComparer,
    valueChanged: (picker, oldValue, newValue) => {
        if (!isValidTime(picker)) {
            throw new Error(getErrorMessage(picker, 'time', newValue));
        }
        picker.hour = newValue.getHours();
        picker.minute = newValue.getMinutes();
    },
});
timeProperty.register(TimePickerBase);
export const iosPreferredDatePickerStyleProperty = new Property({
    name: 'iosPreferredDatePickerStyle',
    defaultValue: 0,
    valueConverter: (v) => parseInt(v),
});
iosPreferredDatePickerStyleProperty.register(TimePickerBase);
//# sourceMappingURL=time-picker-common.js.map