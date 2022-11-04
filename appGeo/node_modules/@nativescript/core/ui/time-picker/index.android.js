import { TimePickerBase, getValidTime, timeProperty, hourProperty, minuteProperty } from './time-picker-common';
export * from './time-picker-common';
let TimeChangedListener;
function initializeTimeChangedListener() {
    if (TimeChangedListener) {
        return;
    }
    apiLevel = android.os.Build.VERSION.SDK_INT;
    var TimeChangedListenerImpl = /** @class */ (function (_super) {
    __extends(TimeChangedListenerImpl, _super);
    function TimeChangedListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    TimeChangedListenerImpl.prototype.onTimeChanged = function (picker, hour, minute) {
        var timePicker = this.owner;
        if (timePicker.updatingNativeValue) {
            return;
        }
        var validTime = getValidTime(timePicker, hour, minute);
        timeProperty.nativeValueChange(timePicker, new Date(0, 0, 0, validTime.hour, validTime.minute));
    };
    TimeChangedListenerImpl = __decorate([
        Interfaces([android.widget.TimePicker.OnTimeChangedListener])
    ], TimeChangedListenerImpl);
    return TimeChangedListenerImpl;
}(java.lang.Object));
    TimeChangedListener = TimeChangedListenerImpl;
}
let apiLevel;
export class TimePicker extends TimePickerBase {
    createNativeView() {
        return new android.widget.TimePicker(this._context);
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        initializeTimeChangedListener();
        const listener = new TimeChangedListener(this);
        nativeView.setOnTimeChangedListener(listener);
        nativeView.listener = listener;
        const calendar = (nativeView.calendar = java.util.Calendar.getInstance());
        const hour = hourProperty.isSet(this) ? this.hour : calendar.get(java.util.Calendar.HOUR_OF_DAY);
        const minute = minuteProperty.isSet(this) ? this.minute : calendar.get(java.util.Calendar.MINUTE);
        const validTime = getValidTime(this, hour, minute);
        if (!timeProperty.isSet(this)) {
            this.time = new Date(0, 0, 0, validTime.hour, validTime.minute);
        }
    }
    [minuteProperty.setNative](value) {
        this.updatingNativeValue = true;
        try {
            if (apiLevel >= 23) {
                this.nativeViewProtected.setMinute(value);
            }
            else {
                this.nativeViewProtected.setCurrentMinute(new java.lang.Integer(value));
            }
        }
        finally {
            this.updatingNativeValue = false;
        }
    }
    [hourProperty.setNative](value) {
        this.updatingNativeValue = true;
        try {
            if (apiLevel >= 23) {
                this.nativeViewProtected.setHour(value);
            }
            else {
                this.nativeViewProtected.setCurrentHour(new java.lang.Integer(value));
            }
        }
        finally {
            this.updatingNativeValue = false;
        }
    }
}
//# sourceMappingURL=index.android.js.map