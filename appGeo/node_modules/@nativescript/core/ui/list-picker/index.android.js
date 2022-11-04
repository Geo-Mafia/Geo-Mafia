import { ListPickerBase, selectedIndexProperty, itemsProperty } from './list-picker-common';
import { colorProperty } from '../styling/style-properties';
import { Color } from '../../color';
import { Device } from '../../platform';
import lazy from '../../utils/lazy';
export * from './list-picker-common';
const sdkVersion = lazy(() => parseInt(Device.sdkVersion));
let Formatter;
let ValueChangeListener;
function initializeNativeClasses() {
    if (Formatter) {
        return;
    }
    var FormatterImpl = /** @class */ (function (_super) {
    __extends(FormatterImpl, _super);
    function FormatterImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    FormatterImpl.prototype.format = function (index) {
        return this.owner._getItemAsString(index);
    };
    FormatterImpl = __decorate([
        Interfaces([android.widget.NumberPicker.Formatter])
    ], FormatterImpl);
    return FormatterImpl;
}(java.lang.Object));
    var ValueChangeListenerImpl = /** @class */ (function (_super) {
    __extends(ValueChangeListenerImpl, _super);
    function ValueChangeListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    ValueChangeListenerImpl.prototype.onValueChange = function (picker, oldValue, newValue) {
        selectedIndexProperty.nativeValueChange(this.owner, newValue);
        this.owner.updateSelectedValue(newValue);
    };
    ValueChangeListenerImpl = __decorate([
        Interfaces([android.widget.NumberPicker.OnValueChangeListener])
    ], ValueChangeListenerImpl);
    return ValueChangeListenerImpl;
}(java.lang.Object));
    Formatter = FormatterImpl;
    ValueChangeListener = ValueChangeListenerImpl;
}
function getEditText(picker) {
    for (let i = 0, count = picker.getChildCount(); i < count; i++) {
        const child = picker.getChildAt(i);
        if (child instanceof android.widget.EditText) {
            return child;
        }
    }
    return null;
}
let selectorWheelPaintField;
function getSelectorWheelPaint(picker) {
    try {
        selectorWheelPaintField = picker.getClass().getDeclaredField('mSelectorWheelPaint');
        if (selectorWheelPaintField) {
            selectorWheelPaintField.setAccessible(true);
        }
    }
    catch (err) {
        // mSelectorWheelPaint is not supported on api level
    }
    if (selectorWheelPaintField) {
        return selectorWheelPaintField.get(picker);
    }
    return null;
}
export class ListPicker extends ListPickerBase {
    createNativeView() {
        const picker = new android.widget.NumberPicker(this._context);
        picker.setDescendantFocusability(android.widget.NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        picker.setMinValue(0);
        picker.setMaxValue(0);
        picker.setValue(0);
        picker.setWrapSelectorWheel(false);
        return picker;
    }
    initNativeView() {
        super.initNativeView();
        initializeNativeClasses();
        const nativeView = this.nativeViewProtected;
        // api28 and lower uses reflection to retrieve and manipulate
        // android.graphics.Paint object; this is no longer allowed on newer api levels but
        // equivalent public methods are exposed on api29+ directly on the native widget
        this._selectorWheelPaint = getSelectorWheelPaint(nativeView);
        const formatter = new Formatter(this);
        nativeView.setFormatter(formatter);
        nativeView.formatter = formatter;
        const valueChangedListener = new ValueChangeListener(this);
        nativeView.setOnValueChangedListener(valueChangedListener);
        nativeView.valueChangedListener = valueChangedListener;
        const editText = getEditText(nativeView);
        if (editText) {
            nativeView.editText = editText;
            //Fix the disappearing selected item.
            //HACK: http://stackoverflow.com/questions/17708325/android-numberpicker-with-formatter-does-not-format-on-first-rendering/26797732
            editText.setFilters([]);
            //Since the Android NumberPicker has to always have at least one item, i.e. minValue=maxValue=value=0, we don't want this zero showing up when this.items is empty.
            editText.setText(' ', android.widget.TextView.BufferType.NORMAL);
        }
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        nativeView.formatter.owner = null;
        nativeView.valueChangedListener.owner = null;
        super.disposeNativeView();
    }
    _fixNumberPickerRendering() {
        const nativeView = this.nativeViewProtected;
        //HACK: Force the stubborn NumberPicker to render correctly when we have 0 or 1 items.
        nativeView.setFormatter(null);
        nativeView.setFormatter(nativeView.formatter); //Force the NumberPicker to call our Formatter
        const editText = nativeView.editText;
        if (editText) {
            editText.setFilters([]);
            editText.invalidate(); //Force the EditText to redraw
        }
        nativeView.invalidate();
    }
    [selectedIndexProperty.getDefault]() {
        return -1;
    }
    [selectedIndexProperty.setNative](value) {
        if (value >= 0) {
            this.nativeViewProtected.setValue(value);
        }
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        const maxValue = value && value.length > 0 ? value.length - 1 : 0;
        this.nativeViewProtected.setMaxValue(maxValue);
        this._fixNumberPickerRendering();
        // Coerce selected index after we have set items to native view.
        selectedIndexProperty.coerce(this);
    }
    [colorProperty.getDefault]() {
        // api28 and lower uses reflection to retrieve and manipulate
        // android.graphics.Paint object; this is no longer allowed on newer api levels but
        // equivalent public methods are exposed on api29+ directly on the native widget
        if (this._selectorWheelPaint) {
            return this._selectorWheelPaint.getColor();
        }
        if (this.nativeView && this.nativeView.getTextColor) {
            return this.nativeView.getTextColor();
        }
        else {
            return 0;
        }
    }
    [colorProperty.setNative](value) {
        const color = value instanceof Color ? value.android : value;
        // api28 and lower uses reflection to retrieve and manipulate
        // android.graphics.Paint object; this is no longer allowed on newer api levels but
        // equivalent public methods are exposed on api29+ directly on the native widget
        if (this._selectorWheelPaint) {
            this._selectorWheelPaint.setColor(color);
            const editText = this.nativeViewProtected.editText;
            if (editText) {
                editText.setTextColor(color);
            }
        }
        else if (this.nativeView && this.nativeView.setTextColor) {
            // api29 and higher native implementation sets
            // both wheel color and input text color with single call
            this.nativeView.setTextColor(color);
        }
    }
}
//# sourceMappingURL=index.android.js.map