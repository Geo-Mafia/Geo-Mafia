import { SwitchBase } from './switch-common';
export * from './switch-common';
export declare class Switch extends SwitchBase {
    nativeViewProtected: android.widget.Switch;
    checked: boolean;
    createNativeView(): globalAndroid.widget.Switch;
    initNativeView(): void;
    disposeNativeView(): void;
    private setNativeBackgroundColor;
    _onCheckedPropertyChanged(newValue: boolean): void;
}
