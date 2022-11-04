import { Font } from '../styling/font';
import { SearchBarBase, textProperty, hintProperty, textFieldHintColorProperty, textFieldBackgroundColorProperty } from './search-bar-common';
import { isUserInteractionEnabledProperty, isEnabledProperty } from '../core/view';
import { ad } from '../../utils';
import { Color } from '../../color';
import { colorProperty, backgroundColorProperty, backgroundInternalProperty, fontInternalProperty, fontSizeProperty } from '../styling/style-properties';
export * from './search-bar-common';
const SEARCHTEXT = Symbol('searchText');
const QUERY = Symbol('query');
let QueryTextListener;
let CloseListener;
function initializeNativeClasses() {
    if (QueryTextListener) {
        return;
    }
    var CompatQueryTextListenerImpl = /** @class */ (function (_super) {
    __extends(CompatQueryTextListenerImpl, _super);
    function CompatQueryTextListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    CompatQueryTextListenerImpl.prototype.onQueryTextChange = function (newText) {
        var owner = this.owner;
        textProperty.nativeValueChange(owner, newText);
        // This code is needed since sometimes OnCloseListener is not called!
        if (newText === '' && this[SEARCHTEXT] !== newText) {
            owner._emit(SearchBarBase.clearEvent);
        }
        this[SEARCHTEXT] = newText;
        this[QUERY] = undefined;
        return true;
    };
    CompatQueryTextListenerImpl.prototype.onQueryTextSubmit = function (query) {
        var owner = this.owner;
        // This code is needed since onQueryTextSubmit is called twice with same query!
        if (query !== '' && this[QUERY] !== query) {
            owner._emit(SearchBarBase.submitEvent);
        }
        this[QUERY] = query;
        return true;
    };
    CompatQueryTextListenerImpl = __decorate([
        Interfaces([androidx.appcompat.widget.SearchView.OnQueryTextListener])
    ], CompatQueryTextListenerImpl);
    return CompatQueryTextListenerImpl;
}(java.lang.Object));
    var CompatCloseListenerImpl = /** @class */ (function (_super) {
    __extends(CompatCloseListenerImpl, _super);
    function CompatCloseListenerImpl(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        return global.__native(_this);
    }
    CompatCloseListenerImpl.prototype.onClose = function () {
        this.owner._emit(SearchBarBase.clearEvent);
        return true;
    };
    CompatCloseListenerImpl = __decorate([
        Interfaces([androidx.appcompat.widget.SearchView.OnCloseListener])
    ], CompatCloseListenerImpl);
    return CompatCloseListenerImpl;
}(java.lang.Object));
    QueryTextListener = CompatQueryTextListenerImpl;
    CloseListener = CompatCloseListenerImpl;
}
function enableSearchView(nativeView, value) {
    nativeView.setEnabled(value);
    if (!(nativeView instanceof android.view.ViewGroup)) {
        return;
    }
    for (let i = 0; i < nativeView.getChildCount(); i++) {
        const child = nativeView.getChildAt(i);
        enableSearchView(child, value);
    }
}
function enableUserInteractionSearchView(nativeView, value) {
    nativeView.setClickable(value);
    nativeView.setFocusable(value);
    if (!(nativeView instanceof android.view.ViewGroup)) {
        return;
    }
    for (let i = 0; i < nativeView.getChildCount(); i++) {
        const child = nativeView.getChildAt(i);
        enableUserInteractionSearchView(child, value);
    }
}
export class SearchBar extends SearchBarBase {
    dismissSoftInput() {
        ad.dismissSoftInput(this.nativeViewProtected);
    }
    focus() {
        const result = super.focus();
        if (result) {
            ad.showSoftInput(this.nativeViewProtected);
        }
        return result;
    }
    createNativeView() {
        const nativeView = new androidx.appcompat.widget.SearchView(this._context);
        nativeView.setIconified(false);
        return nativeView;
    }
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        initializeNativeClasses();
        const queryTextListener = new QueryTextListener(this);
        nativeView.setOnQueryTextListener(queryTextListener);
        nativeView.queryTextListener = queryTextListener;
        const closeListener = new CloseListener(this);
        nativeView.setOnCloseListener(closeListener);
        nativeView.closeListener = closeListener;
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        nativeView.closeListener.owner = null;
        nativeView.queryTextListener.owner = null;
        this._searchPlate = null;
        this._searchTextView = null;
        super.disposeNativeView();
    }
    [isEnabledProperty.setNative](value) {
        enableSearchView(this.nativeViewProtected, value);
    }
    [isUserInteractionEnabledProperty.setNative](value) {
        enableUserInteractionSearchView(this.nativeViewProtected, value);
    }
    [backgroundColorProperty.getDefault]() {
        // TODO: Why do we get DrawingCacheBackgroundColor but set backgroundColor?????
        const result = this.nativeViewProtected.getDrawingCacheBackgroundColor();
        return result;
    }
    [backgroundColorProperty.setNative](value) {
        let color;
        if (typeof value === 'number') {
            color = value;
        }
        else {
            color = value.android;
        }
        this.nativeViewProtected.setBackgroundColor(color);
        const searchPlate = this._getSearchPlate();
        searchPlate.setBackgroundColor(color);
    }
    [colorProperty.getDefault]() {
        const textView = this._getTextView();
        return textView.getCurrentTextColor();
    }
    [colorProperty.setNative](value) {
        const color = typeof value === 'number' ? value : value.android;
        const textView = this._getTextView();
        textView.setTextColor(color);
    }
    [fontSizeProperty.getDefault]() {
        return { nativeSize: this._getTextView().getTextSize() };
    }
    [fontSizeProperty.setNative](value) {
        if (typeof value === 'number') {
            this._getTextView().setTextSize(value);
        }
        else {
            this._getTextView().setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }
    [fontInternalProperty.getDefault]() {
        return this._getTextView().getTypeface();
    }
    [fontInternalProperty.setNative](value) {
        this._getTextView().setTypeface(value instanceof Font ? value.getAndroidTypeface() : value);
    }
    [backgroundInternalProperty.getDefault]() {
        return null;
    }
    [backgroundInternalProperty.setNative](value) {
        //
    }
    [textProperty.getDefault]() {
        return '';
    }
    [textProperty.setNative](value) {
        const text = value === null || value === undefined ? '' : value.toString();
        this.nativeViewProtected.setQuery(text, false);
    }
    [hintProperty.getDefault]() {
        return null;
    }
    [hintProperty.setNative](value) {
        if (value === null || value === undefined) {
            this.nativeViewProtected.setQueryHint(null);
        }
        else {
            this.nativeViewProtected.setQueryHint(value.toString());
        }
    }
    [textFieldBackgroundColorProperty.getDefault]() {
        const textView = this._getTextView();
        return textView.getBackground();
    }
    [textFieldBackgroundColorProperty.setNative](value) {
        const textView = this._getTextView();
        if (value instanceof Color) {
            textView.setBackgroundColor(value.android);
        }
        else {
            textView.setBackground(value);
        }
    }
    [textFieldHintColorProperty.getDefault]() {
        const textView = this._getTextView();
        return textView.getCurrentTextColor();
    }
    [textFieldHintColorProperty.setNative](value) {
        const textView = this._getTextView();
        const color = value instanceof Color ? value.android : value;
        textView.setHintTextColor(color);
    }
    _getTextView() {
        if (!this._searchTextView) {
            const pkgName = this.nativeViewProtected.getContext().getPackageName();
            const id = this.nativeViewProtected.getContext().getResources().getIdentifier('search_src_text', 'id', pkgName);
            this._searchTextView = this.nativeViewProtected.findViewById(id);
        }
        return this._searchTextView;
    }
    _getSearchPlate() {
        if (!this._searchPlate) {
            const pkgName = this.nativeViewProtected.getContext().getPackageName();
            const id = this.nativeViewProtected.getContext().getResources().getIdentifier('search_plate', 'id', pkgName);
            this._searchPlate = this.nativeViewProtected.findViewById(id);
        }
        return this._searchPlate;
    }
}
//# sourceMappingURL=index.android.js.map