import { TextFieldBase } from './text-field-common';
export * from './text-field-common';
export declare class TextField extends TextFieldBase {
    _configureEditText(editText: android.widget.EditText): void;
    _onReturnPress(): void;
    setSecureAndKeyboardType(): void;
}
