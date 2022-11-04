import { LayoutBaseCommon } from './layout-base-common';
import { View } from '../core/view';
export * from './layout-base-common';
export declare class LayoutBase extends LayoutBaseCommon {
    nativeViewProtected: UIView;
    addChild(child: View): void;
    insertChild(child: View, atIndex: number): void;
    removeChild(child: View): void;
    _setNativeClipToBounds(): void;
}
