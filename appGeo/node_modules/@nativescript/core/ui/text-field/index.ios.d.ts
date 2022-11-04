import { TextFieldBase } from './text-field-common';
export * from './text-field-common';
declare class UITextFieldImpl extends UITextField {
    private _owner;
    static initWithOwner(owner: WeakRef<TextField>): UITextFieldImpl;
    private _getTextRectForBounds;
    textRectForBounds(bounds: CGRect): CGRect;
    editingRectForBounds(bounds: CGRect): CGRect;
}
export declare class TextField extends TextFieldBase {
    nativeViewProtected: UITextField;
    private _delegate;
    createNativeView(): UITextFieldImpl;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get ios(): UITextField;
    private firstEdit;
    textFieldShouldBeginEditing(textField: UITextField): boolean;
    textFieldDidBeginEditing(textField: UITextField): void;
    textFieldDidEndEditing(textField: UITextField): void;
    textFieldShouldClear(textField: UITextField): boolean;
    textFieldShouldReturn(textField: UITextField): boolean;
    textFieldShouldChangeCharactersInRangeReplacementString(textField: UITextField, range: NSRange, replacementString: string): boolean;
    _updateAttributedPlaceholder(): void;
}
