import { ListPickerBase } from './list-picker-common';
export * from './list-picker-common';
export declare class ListPicker extends ListPickerBase {
    nativeViewProtected: UIPickerView;
    private _dataSource;
    private _delegate;
    createNativeView(): UIPickerView;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UIPickerView;
    onLoaded(): void;
    onUnloaded(): void;
}
