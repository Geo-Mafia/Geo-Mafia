import { SwitchBase } from './switch-common';
export * from './switch-common';
export declare class Switch extends SwitchBase {
    nativeViewProtected: UISwitch;
    private _handler;
    constructor();
    createNativeView(): UISwitch;
    initNativeView(): void;
    disposeNativeView(): void;
    private setNativeBackgroundColor;
    _onCheckedPropertyChanged(newValue: boolean): void;
    get ios(): UISwitch;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
