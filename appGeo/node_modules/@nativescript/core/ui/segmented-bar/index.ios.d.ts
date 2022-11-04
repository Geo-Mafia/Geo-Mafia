import { SegmentedBarItemBase, SegmentedBarBase } from './segmented-bar-common';
export * from './segmented-bar-common';
export declare class SegmentedBarItem extends SegmentedBarItemBase {
    _update(): void;
}
export declare class SegmentedBar extends SegmentedBarBase {
    nativeViewProtected: UISegmentedControl;
    private _selectionHandler;
    createNativeView(): UISegmentedControl;
    initNativeView(): void;
    disposeNativeView(): void;
    get ios(): UISegmentedControl;
}
