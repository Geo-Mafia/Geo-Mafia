import { Font } from '../styling/font';
import { SearchBarBase, textProperty, hintProperty, textFieldHintColorProperty, textFieldBackgroundColorProperty } from './search-bar-common';
import { isEnabledProperty } from '../core/view';
import { Color } from '../../color';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty, fontInternalProperty } from '../styling/style-properties';
import { iOSNativeHelper } from '../../utils';
export * from './search-bar-common';
const majorVersion = iOSNativeHelper.MajorVersion;
var UISearchBarDelegateImpl = /** @class */ (function (_super) {
    __extends(UISearchBarDelegateImpl, _super);
    function UISearchBarDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UISearchBarDelegateImpl.initWithOwner = function (owner) {
        var delegate = UISearchBarDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    UISearchBarDelegateImpl.prototype.searchBarTextDidChange = function (searchBar, searchText) {
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        textProperty.nativeValueChange(owner, searchText);
        // This code is needed since sometimes searchBarCancelButtonClicked is not called!
        if (searchText === '') {
            owner._emit(SearchBarBase.clearEvent);
        }
    };
    UISearchBarDelegateImpl.prototype.searchBarCancelButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        owner._emit(SearchBarBase.clearEvent);
    };
    UISearchBarDelegateImpl.prototype.searchBarSearchButtonClicked = function (searchBar) {
        searchBar.resignFirstResponder();
        var owner = this._owner.get();
        if (!owner) {
            return;
        }
        owner._emit(SearchBarBase.submitEvent);
    };
    UISearchBarDelegateImpl.ObjCProtocols = [UISearchBarDelegate];
    return UISearchBarDelegateImpl;
}(NSObject));
var UISearchBarImpl = /** @class */ (function (_super) {
    __extends(UISearchBarImpl, _super);
    function UISearchBarImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UISearchBarImpl.prototype.sizeThatFits = function (size) {
        // iOS11 SDK does not support passing sizeThatFits(...) non-finite width value;
        // iOS layout system will take care to size the element properly when passed 0
        if (majorVersion >= 11 && size.width === Number.POSITIVE_INFINITY) {
            size.width = 0;
        }
        return _super.prototype.sizeThatFits.call(this, size);
    };
    return UISearchBarImpl;
}(UISearchBar));
export class SearchBar extends SearchBarBase {
    createNativeView() {
        return UISearchBarImpl.new();
    }
    initNativeView() {
        super.initNativeView();
        this._delegate = UISearchBarDelegateImpl.initWithOwner(new WeakRef(this));
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
    dismissSoftInput() {
        this.ios.resignFirstResponder();
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    get _textField() {
        if (!this.__textField) {
            this.__textField = this.ios.valueForKey('searchField');
        }
        return this.__textField;
    }
    [isEnabledProperty.setNative](value) {
        const nativeView = this.nativeViewProtected;
        if (nativeView instanceof UIControl) {
            nativeView.enabled = value;
        }
        const textField = this._textField;
        if (textField) {
            textField.enabled = value;
        }
    }
    [backgroundColorProperty.getDefault]() {
        return this.ios.barTintColor;
    }
    [backgroundColorProperty.setNative](value) {
        const color = value instanceof Color ? value.ios : value;
        this.ios.barTintColor = color;
    }
    [colorProperty.getDefault]() {
        const sf = this._textField;
        if (sf) {
            return sf.textColor;
        }
        return null;
    }
    [colorProperty.setNative](value) {
        const sf = this._textField;
        const color = value instanceof Color ? value.ios : value;
        if (sf) {
            sf.textColor = color;
            sf.tintColor = color;
        }
    }
    [fontInternalProperty.getDefault]() {
        const sf = this._textField;
        return sf ? sf.font : null;
    }
    [fontInternalProperty.setNative](value) {
        const sf = this._textField;
        if (sf) {
            sf.font = value instanceof Font ? value.getUIFont(sf.font) : value;
        }
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        //
    }
    [textProperty.getDefault]() {
        return '';
    }
    [textProperty.setNative](value) {
        const text = value === null || value === undefined ? '' : value.toString();
        this.ios.text = text;
    }
    [hintProperty.getDefault]() {
        return '';
    }
    [hintProperty.setNative](value) {
        this._updateAttributedPlaceholder();
    }
    [textFieldBackgroundColorProperty.getDefault]() {
        const textField = this._textField;
        if (textField) {
            return textField.backgroundColor;
        }
        return null;
    }
    [textFieldBackgroundColorProperty.setNative](value) {
        const color = value instanceof Color ? value.ios : value;
        const textField = this._textField;
        if (textField) {
            textField.backgroundColor = color;
        }
    }
    [textFieldHintColorProperty.getDefault]() {
        return null;
    }
    [textFieldHintColorProperty.setNative](value) {
        this._updateAttributedPlaceholder();
    }
    // Very similar to text-field.ios.ts implementation. Maybe unify APIs and base classes?
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
        if (this.textFieldHintColor) {
            attributes[NSForegroundColorAttributeName] = this.textFieldHintColor.ios;
        }
        const attributedPlaceholder = NSAttributedString.alloc().initWithStringAttributes(stringValue, attributes);
        this._textField.attributedPlaceholder = attributedPlaceholder;
    }
}
//# sourceMappingURL=index.ios.js.map