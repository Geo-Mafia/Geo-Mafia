import { ButtonBase } from './button-common';
export * from './button-common';
export declare class Button extends ButtonBase {
    nativeViewProtected: UIButton;
    private _tapHandler;
    private _stateChangedHandler;
    createNativeView(): UIButton;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UIButton;
    onUnloaded(): void;
    _updateButtonStateChangeHandler(subscribe: boolean): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
}
