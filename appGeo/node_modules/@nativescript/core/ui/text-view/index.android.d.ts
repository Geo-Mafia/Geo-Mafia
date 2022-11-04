import { TextViewBase as TextViewBaseCommon } from './text-view-common';
export * from '../text-base';
export declare class TextView extends TextViewBaseCommon {
    _configureEditText(editText: android.widget.EditText): void;
    resetNativeView(): void;
    _onReturnPress(): void;
}
