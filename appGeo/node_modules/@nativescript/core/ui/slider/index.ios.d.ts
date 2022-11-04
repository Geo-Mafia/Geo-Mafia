import { SliderBase } from './slider-common';
export * from './slider-common';
declare class TNSSlider extends UISlider {
    owner: WeakRef<Slider>;
    static initWithOwner(owner: WeakRef<Slider>): TNSSlider;
    accessibilityIncrement(): void;
    accessibilityDecrement(): void;
}
export declare class Slider extends SliderBase {
    nativeViewProtected: TNSSlider;
    private _changeHandler;
    createNativeView(): TNSSlider;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UISlider;
    private getAccessibilityStep;
    _handlerAccessibilityIncrementEvent(): number;
    _handlerAccessibilityDecrementEvent(): number;
}
