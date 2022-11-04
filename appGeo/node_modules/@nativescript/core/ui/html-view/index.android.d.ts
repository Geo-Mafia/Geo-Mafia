import { HtmlViewBase } from './html-view-common';
export * from './html-view-common';
export declare class HtmlView extends HtmlViewBase {
    nativeViewProtected: android.widget.TextView;
    createNativeView(): globalAndroid.widget.TextView;
    initNativeView(): void;
    resetNativeView(): void;
}
