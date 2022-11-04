import { ListViewBase } from './list-view-common';
import { View } from '../core/view';
export * from './list-view-common';
export declare class ListView extends ListViewBase {
    nativeViewProtected: android.widget.ListView;
    private _androidViewId;
    _realizedItems: Map<globalAndroid.view.View, {
        view: View;
        templateKey: string;
    }>;
    _availableViews: Map<string, Set<globalAndroid.view.View>>;
    _realizedTemplates: Map<string, Map<globalAndroid.view.View, View>>;
    private _ensureAvailableViews;
    _registerViewToTemplate(templateKey: string, nativeView: android.view.View, view: View): void;
    _markViewUsed(nativeView: android.view.View): void;
    _markViewUnused(nativeView: android.view.View): void;
    _getKeyFromView(nativeView: android.view.View): string;
    _hasAvailableView(templateKey: string): boolean;
    _getAvailableView(templateKey: string): globalAndroid.view.View;
    createNativeView(): globalAndroid.widget.ListView;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    refresh(): void;
    scrollToIndex(index: number): void;
    scrollToIndexAnimated(index: number): void;
    get _childrenCount(): number;
    eachChildView(callback: (child: View) => boolean): void;
    _dumpRealizedTemplates(): void;
    private clearRealizedCells;
    isItemAtIndexVisible(index: number): boolean;
}
