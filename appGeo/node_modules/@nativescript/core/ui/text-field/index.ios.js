import { TextFieldBase, secureProperty } from './text-field-common';
import { textProperty } from '../text-base';
import { hintProperty, placeholderColorProperty, _updateCharactersInRangeReplacementString } from '../editable-text-base';
import { Color } from '../../color';
import { colorProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, paddingLeftProperty } from '../styling/style-properties';
import { layout } from '../../utils';
import { profile } from '../../profiling';
export * from './text-field-common';
const zeroLength = {
    value: 0,
    unit: 'px',
};
var UITextFieldDelegateImpl = /** @class */ (function (_super) {
    __extends(UITextFieldDelegateImpl, _super);
    function UITextFieldDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITextFieldDelegateImpl.initWithOwner = function (owner) {
        var delegate = UITextFieldDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldBeginEditing = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            return owner.textFieldShouldBeginEditing(textField);
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldDidBeginEditing = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            owner.textFieldDidBeginEditing(textField);
        }
    };
    UITextFieldDelegateImpl.prototype.textFieldDidEndEditing = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            owner.textFieldDidEndEditing(textField);
        }
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldClear = function (textField) {
        var owner = this._owner.get();
        if (owner) {
            return owner.textFieldShouldClear(textField);
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldReturn = function (textField) {
        // Called when the user presses the return button.
        var owner = this._owner.get();
        if (owner) {
            return owner.textFieldShouldReturn(textField);
        }
        return true;
    };
    UITextFieldDelegateImpl.prototype.textFieldShouldChangeCharactersInRangeReplacementString = function (textField, range, replacementString) {
        var owner = this._owner.get();
        if (owner) {
            return owner.textFieldShouldChangeCharactersInRangeReplacementString(textField, range, replacementString);
        }
        return true;
    };
    UITextFieldDelegateImpl.ObjCProtocols = [UITextFieldDelegate];
    return UITextFieldDelegateImpl;
}(NSObject));
var UITextFieldImpl = /** @class */ (function (_super) {
    __extends(UITextFieldImpl, _super);
    function UITextFieldImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITextFieldImpl.initWithOwner = function (owner) {
        var handler = UITextFieldImpl.new();
        handler._owner = owner;
        return handler;
    };
    UITextFieldImpl.prototype._getTextRectForBounds = function (bounds) {
        var owner = this._owner ? this._owner.get() : null;
        if (!owner) {
            return bounds;
        }
        var size = bounds.size;
        var x = layout.toDeviceIndependentPixels(owner.effectiveBorderLeftWidth + owner.effectivePaddingLeft);
        var y = layout.toDeviceIndependentPixels(owner.effectiveBorderTopWidth + owner.effectivePaddingTop);
        var width = layout.toDeviceIndependentPixels(layout.toDevicePixels(size.width) - (owner.effectiveBorderLeftWidth + owner.effectivePaddingLeft + owner.effectivePaddingRight + owner.effectiveBorderRightWidth));
        var height = layout.toDeviceIndependentPixels(layout.toDevicePixels(size.height) - (owner.effectiveBorderTopWidth + owner.effectivePaddingTop + owner.effectivePaddingBottom + owner.effectiveBorderBottomWidth));
        return CGRectMake(x, y, width, height);
    };
    UITextFieldImpl.prototype.textRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    UITextFieldImpl.prototype.editingRectForBounds = function (bounds) {
        return this._getTextRectForBounds(bounds);
    };
    return UITextFieldImpl;
}(UITextField));
export class TextField extends TextFieldBase {
    createNativeView() {
        return UITextFieldImpl.initWithOwner(new WeakRef(this));
    }
    initNativeView() {
        super.initNativeView();
        this._delegate = UITextFieldDelegateImpl.initWithOwner(new WeakRef(this));
    }
    disposeNativeView() {
        this._delegate = null;
        super.disposeNativeView();
    }
    onLoaded() {
        super.onLoaded();
        this.ios.delegate = this._delegate;
    }
    onUnloaded() {
        this.ios.delegate = null;
        super.onUnloaded();
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    textFieldShouldBeginEditing(textField) {
        this.firstEdit = true;
        return this.editable;
    }
    textFieldDidBeginEditing(textField) {
        this.notify({ eventName: TextField.focusEvent, object: this });
    }
    textFieldDidEndEditing(textField) {
        if (this.updateTextTrigger === 'focusLost') {
            textProperty.nativeValueChange(this, textField.text);
        }
        this.dismissSoftInput();
    }
    textFieldShouldClear(textField) {
        this.firstEdit = false;
        textProperty.nativeValueChange(this, '');
        return true;
    }
    textFieldShouldReturn(textField) {
        // Called when the user presses the return button.
        if (this.closeOnReturn) {
            this.dismissSoftInput();
        }
        this.notify({ eventName: TextField.returnPressEvent, object: this });
        return true;
    }
    textFieldShouldChangeCharactersInRangeReplacementString(textField, range, replacementString) {
        if (this.secureWithoutAutofill && !textField.secureTextEntry) {
            /**
             * Helps avoid iOS 12+ autofill strong password suggestion prompt
             * Discussed in several circles but for example:
             * https://github.com/expo/expo/issues/2571#issuecomment-473347380
             */
            textField.secureTextEntry = true;
        }
        const delta = replacementString.length - range.length;
        if (delta > 0) {
            if (textField.text.length + delta > this.maxLength) {
                return false;
            }
        }
        if (this.updateTextTrigger === 'textChanged') {
            const shouldReplaceString = (textField.secureTextEntry && this.firstEdit) || delta > 1;
            if (shouldReplaceString) {
                textProperty.nativeValueChange(this, replacementString);
            }
            else {
                if (range.location <= textField.text.length) {
                    const newText = NSString.stringWithString(textField.text).stringByReplacingCharactersInRangeWithString(range, replacementString);
                    textProperty.nativeValueChange(this, newText);
                }
            }
        }
        if (this.formattedText) {
            _updateCharactersInRangeReplacementString(this.formattedText, range.location, range.length, replacementString);
        }
        if (this.width === 'auto') {
            // if the textfield is in auto size we need to request a layout to take the new text width into account
            this.requestLayout();
        }
        this.firstEdit = false;
        return true;
    }
    [hintProperty.getDefault]() {
        return this.nativeTextViewProtected.placeholder;
    }
    [hintProperty.setNative](value) {
        this._updateAttributedPlaceholder();
    }
    [secureProperty.getDefault]() {
        return this.nativeTextViewProtected.secureTextEntry;
    }
    [secureProperty.setNative](value) {
        this.nativeTextViewProtected.secureTextEntry = value;
    }
    [colorProperty.getDefault]() {
        return {
            textColor: this.nativeTextViewProtected.textColor,
            tintColor: this.nativeTextViewProtected.tintColor,
        };
    }
    [colorProperty.setNative](value) {
        if (value instanceof Color) {
            const color = value instanceof Color ? value.ios : value;
            this.nativeTextViewProtected.textColor = color;
            this.nativeTextViewProtected.tintColor = color;
        }
        else {
            this.nativeTextViewProtected.textColor = value.textColor;
            this.nativeTextViewProtected.tintColor = value.tintColor;
        }
    }
    [placeholderColorProperty.getDefault]() {
        return null;
    }
    [placeholderColorProperty.setNative](value) {
        this._updateAttributedPlaceholder();
    }
    _updateAttributedPlaceholder() {
        let stringValue = this.hint;
        if (stringValue === null || stringValue === void 0) {
            stringValue = '';
        }
        else {
            stringValue = stringValue + '';
        }
        if (stringValue === '') {
            // we do not use empty string since initWithStringAttributes does not return proper value and
            // nativeView.attributedPlaceholder will be null
            stringValue = ' ';
        }
        const attributes = {};
        if (this.style.placeholderColor) {
            attributes[NSForegroundColorAttributeName] = this.style.placeholderColor.ios;
        }
        const attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(stringValue, attributes);
        this.nativeTextViewProtected.attributedPlaceholder = attributedPlaceholder;
    }
    [paddingTopProperty.getDefault]() {
        return zeroLength;
    }
    [paddingTopProperty.setNative](value) {
        // Padding is realized via UITextFieldImpl.textRectForBounds method
    }
    [paddingRightProperty.getDefault]() {
        return zeroLength;
    }
    [paddingRightProperty.setNative](value) {
        // Padding is realized via UITextFieldImpl.textRectForBounds method
    }
    [paddingBottomProperty.getDefault]() {
        return zeroLength;
    }
    [paddingBottomProperty.setNative](value) {
        // Padding is realized via UITextFieldImpl.textRectForBounds method
    }
    [paddingLeftProperty.getDefault]() {
        return zeroLength;
    }
    [paddingLeftProperty.setNative](value) {
        // Padding is realized via UITextFieldImpl.textRectForBounds method
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TextField.prototype, "onLoaded", null);
//# sourceMappingURL=index.ios.js.map