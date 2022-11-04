import { FlexboxLayoutBase } from './flexbox-layout-common';
import { CoreTypes } from '../../../core-types';
import { View } from '../../core/view';
export * from './flexbox-layout-common';
export declare class FlexboxLayout extends FlexboxLayoutBase {
    nativeViewProtected: org.nativescript.widgets.FlexboxLayout;
    constructor();
    createNativeView(): org.nativescript.widgets.FlexboxLayout;
    resetNativeView(): void;
    _updateNativeLayoutParams(child: View): void;
    _setChildMinWidthNative(child: View, value: CoreTypes.LengthType): void;
    _setChildMinHeightNative(child: View, value: CoreTypes.LengthType): void;
}
