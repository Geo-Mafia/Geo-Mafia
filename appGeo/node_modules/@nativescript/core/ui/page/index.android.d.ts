import { PageBase } from './page-common';
import { View } from '../core/view';
export * from './page-common';
export declare class Page extends PageBase {
    nativeViewProtected: org.nativescript.widgets.GridLayout;
    createNativeView(): org.nativescript.widgets.GridLayout;
    initNativeView(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    onLoaded(): void;
    private updateActionBar;
    accessibilityScreenChanged(refocus?: boolean): void;
}
