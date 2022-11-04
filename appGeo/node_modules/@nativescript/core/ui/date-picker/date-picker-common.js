import { View, CSSType } from '../core/view';
import { booleanConverter } from '../core/view-base';
import { Property } from '../core/properties';
const defaultDate = new Date();
const dateComparer = (x, y) => x <= y && x >= y;
let DatePickerBase = class DatePickerBase extends View {
};
DatePickerBase = __decorate([
    CSSType('DatePicker')
], DatePickerBase);
export { DatePickerBase };
DatePickerBase.prototype.recycleNativeView = 'auto';
export const yearProperty = new Property({
    name: 'year',
    defaultValue: defaultDate.getFullYear(),
    valueConverter: (v) => parseInt(v),
});
yearProperty.register(DatePickerBase);
export const monthProperty = new Property({
    name: 'month',
    defaultValue: defaultDate.getMonth() + 1,
    valueConverter: (v) => parseInt(v),
});
monthProperty.register(DatePickerBase);
export const dayProperty = new Property({
    name: 'day',
    defaultValue: defaultDate.getDate(),
    valueConverter: (v) => parseInt(v),
});
dayProperty.register(DatePickerBase);
export const hourProperty = new Property({
    name: 'hour',
    defaultValue: defaultDate.getHours(),
    valueConverter: (v) => parseInt(v),
});
hourProperty.register(DatePickerBase);
export const minuteProperty = new Property({
    name: 'minute',
    defaultValue: defaultDate.getMinutes(),
    valueConverter: (v) => parseInt(v),
});
minuteProperty.register(DatePickerBase);
export const secondProperty = new Property({
    name: 'second',
    defaultValue: defaultDate.getSeconds(),
    valueConverter: (v) => parseInt(v),
});
secondProperty.register(DatePickerBase);
// TODO: Make CoercibleProperties
export const maxDateProperty = new Property({
    name: 'maxDate',
    equalityComparer: dateComparer,
    valueConverter: (v) => new Date(v),
});
maxDateProperty.register(DatePickerBase);
export const minDateProperty = new Property({
    name: 'minDate',
    equalityComparer: dateComparer,
    valueConverter: (v) => new Date(v),
});
minDateProperty.register(DatePickerBase);
export const dateProperty = new Property({
    name: 'date',
    defaultValue: defaultDate,
    equalityComparer: dateComparer,
    valueConverter: (v) => new Date(v),
});
dateProperty.register(DatePickerBase);
export const showTimeProperty = new Property({
    name: 'showTime',
    defaultValue: false,
    valueConverter: (v) => booleanConverter(v),
});
showTimeProperty.register(DatePickerBase);
export const iosPreferredDatePickerStyleProperty = new Property({
    name: 'iosPreferredDatePickerStyle',
    defaultValue: 0,
    valueConverter: (v) => parseInt(v),
});
iosPreferredDatePickerStyleProperty.register(DatePickerBase);
//# sourceMappingURL=date-picker-common.js.map