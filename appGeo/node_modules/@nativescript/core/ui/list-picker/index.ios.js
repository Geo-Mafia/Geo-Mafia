import { ListPickerBase, selectedIndexProperty, itemsProperty } from './list-picker-common';
import { Color } from '../../color';
import { backgroundColorProperty, colorProperty } from '../styling/style-properties';
import { profile } from '../../profiling';
export * from './list-picker-common';
export class ListPicker extends ListPickerBase {
    createNativeView() {
        return UIPickerView.new();
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        nativeView.dataSource = this._dataSource = ListPickerDataSource.initWithOwner(new WeakRef(this));
        this._delegate = ListPickerDelegateImpl.initWithOwner(new WeakRef(this));
    }
    disposeNativeView() {
        this._dataSource = null;
        this._delegate = null;
        super.disposeNativeView();
    }
    // @ts-ignore
    get ios() {
        return this.nativeViewProtected;
    }
    onLoaded() {
        super.onLoaded();
        this.ios.delegate = this._delegate;
    }
    onUnloaded() {
        this.ios.delegate = null;
        super.onUnloaded();
    }
    [selectedIndexProperty.getDefault]() {
        return -1;
    }
    [selectedIndexProperty.setNative](value) {
        if (value >= 0) {
            this.ios.selectRowInComponentAnimated(value, 0, false);
        }
    }
    [itemsProperty.getDefault]() {
        return null;
    }
    [itemsProperty.setNative](value) {
        this.ios.reloadAllComponents();
        // Coerce selected index after we have set items to native view.
        selectedIndexProperty.coerce(this);
    }
    [backgroundColorProperty.getDefault]() {
        return this.ios.backgroundColor;
    }
    [backgroundColorProperty.setNative](value) {
        this.ios.backgroundColor = value instanceof Color ? value.ios : value;
    }
    [colorProperty.getDefault]() {
        return this.ios.tintColor;
    }
    [colorProperty.setNative](value) {
        this.ios.tintColor = value instanceof Color ? value.ios : value;
    }
}
__decorate([
    profile,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ListPicker.prototype, "onLoaded", null);
var ListPickerDataSource = /** @class */ (function (_super) {
    __extends(ListPickerDataSource, _super);
    function ListPickerDataSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerDataSource.initWithOwner = function (owner) {
        var dataSource = ListPickerDataSource.new();
        dataSource._owner = owner;
        return dataSource;
    };
    ListPickerDataSource.prototype.numberOfComponentsInPickerView = function (pickerView) {
        return 1;
    };
    ListPickerDataSource.prototype.pickerViewNumberOfRowsInComponent = function (pickerView, component) {
        var owner = this._owner.get();
        return owner && owner.items ? owner.items.length : 0;
    };
    ListPickerDataSource.ObjCProtocols = [UIPickerViewDataSource];
    return ListPickerDataSource;
}(NSObject));
var ListPickerDelegateImpl = /** @class */ (function (_super) {
    __extends(ListPickerDelegateImpl, _super);
    function ListPickerDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ListPickerDelegateImpl.initWithOwner = function (owner) {
        var delegate = ListPickerDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    };
    ListPickerDelegateImpl.prototype.pickerViewAttributedTitleForRowForComponent = function (pickerView, row, component) {
        var _a, _b;
        var owner = this._owner.get();
        if (owner) {
            var title = NSAttributedString.alloc().initWithStringAttributes(owner._getItemAsString(row), (_a = {}, _a[NSForegroundColorAttributeName] = pickerView.tintColor, _a));
            return title;
        }
        return NSAttributedString.alloc().initWithStringAttributes(row.toString(), (_b = {}, _b[NSForegroundColorAttributeName] = pickerView.tintColor, _b));
    };
    ListPickerDelegateImpl.prototype.pickerViewDidSelectRowInComponent = function (pickerView, row, component) {
        var owner = this._owner.get();
        if (owner) {
            selectedIndexProperty.nativeValueChange(owner, row);
            owner.updateSelectedValue(row);
        }
    };
    ListPickerDelegateImpl.ObjCProtocols = [UIPickerViewDelegate];
    return ListPickerDelegateImpl;
}(NSObject));
//# sourceMappingURL=index.ios.js.map