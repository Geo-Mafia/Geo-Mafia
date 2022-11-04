import { TabViewBase, TabViewItemBase } from './tab-view-common';
export * from './tab-view-common';
export declare class TabViewItem extends TabViewItemBase {
    nativeViewProtected: android.widget.TextView;
    tabItemSpec: org.nativescript.widgets.TabItemSpec;
    index: number;
    private _defaultTransformationMethod;
    get _hasFragments(): boolean;
    initNativeView(): void;
    onLoaded(): void;
    resetNativeView(): void;
    disposeNativeView(): void;
    createNativeView(): globalAndroid.widget.TextView;
    _update(): void;
    _getChildFragmentManager(): androidx.fragment.app.FragmentManager;
}
export declare const tabs: WeakRef<TabView>[];
export declare class TabView extends TabViewBase {
    private _tabLayout;
    private _viewPager;
    private _pagerAdapter;
    private _androidViewId;
    _originalBackground: any;
    constructor();
    get _hasFragments(): boolean;
    onItemsChanged(oldItems: TabViewItem[], newItems: TabViewItem[]): void;
    createNativeView(): org.nativescript.widgets.GridLayout;
    initNativeView(): void;
    _loadUnloadTabItems(newIndex: number): void;
    onLoaded(): void;
    onUnloaded(): void;
    disposeNativeView(): void;
    _onRootViewReset(): void;
    private disposeCurrentFragments;
    private shouldUpdateAdapter;
    private setAdapterItems;
    private getNativeRenderingMode;
    updateAndroidItemAt(index: number, spec: org.nativescript.widgets.TabItemSpec): void;
}
