import { WebViewBase } from './web-view-common';
export * from './web-view-common';
export declare class WebView extends WebViewBase {
    nativeViewProtected: android.webkit.WebView;
    createNativeView(): globalAndroid.webkit.WebView;
    initNativeView(): void;
    disposeNativeView(): void;
    private _disableZoom;
    _loadUrl(src: string): void;
    _loadData(src: string): void;
    get canGoBack(): boolean;
    stopLoading(): void;
    get canGoForward(): boolean;
    goBack(): void;
    goForward(): void;
    reload(): void;
}
