import { View } from '../../core/view';
import { RootLayoutBase } from './root-layout-common';
import { ShadeCoverOptions } from '.';
export * from './root-layout-common';
export declare class RootLayout extends RootLayoutBase {
    constructor();
    insertChild(view: View, atIndex: number): void;
    removeChild(view: View): void;
    protected _bringToFront(view: View): void;
    protected _initShadeCover(view: View, shadeOptions: ShadeCoverOptions): void;
    protected _updateShadeCover(view: View, shadeOptions: ShadeCoverOptions): Promise<void>;
    protected _closeShadeCover(view: View, shadeOptions: ShadeCoverOptions): Promise<void>;
    private _getAnimationSet;
    private _getBackgroundColorAnimator;
    private _playAnimation;
}
