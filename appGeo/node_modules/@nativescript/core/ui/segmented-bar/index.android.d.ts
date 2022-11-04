import { SegmentedBarItemBase, SegmentedBarBase } from './segmented-bar-common';
export * from './segmented-bar-common';
export declare class SegmentedBarItem extends SegmentedBarItemBase {
    nativeViewProtected: android.widget.TextView;
    setupNativeView(tabIndex: number): void;
    private titleDirty;
    _update(): void;
}
export declare class SegmentedBar extends SegmentedBarBase {
    nativeViewProtected: android.widget.TabHost;
    private _tabContentFactory;
    private _addingTab;
    shouldChangeSelectedIndex(): boolean;
    createNativeView(): globalAndroid.widget.TabHost;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    private insertTab;
}
