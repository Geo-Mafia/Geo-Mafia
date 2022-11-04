import { SearchBarBase } from './search-bar-common';
export * from './search-bar-common';
export declare class SearchBar extends SearchBarBase {
    nativeViewProtected: UISearchBar;
    private _delegate;
    private __textField;
    createNativeView(): UISearchBar;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    dismissSoftInput(): void;
    get ios(): UISearchBar;
    get _textField(): UITextField;
    _updateAttributedPlaceholder(): void;
}
