import { SearchBarBase } from './search-bar-common';
export * from './search-bar-common';
export declare class SearchBar extends SearchBarBase {
    nativeViewProtected: androidx.appcompat.widget.SearchView;
    private _searchTextView;
    private _searchPlate;
    dismissSoftInput(): void;
    focus(): boolean;
    createNativeView(): androidx.appcompat.widget.SearchView;
    initNativeView(): void;
    disposeNativeView(): void;
    private _getTextView;
    private _getSearchPlate;
}
