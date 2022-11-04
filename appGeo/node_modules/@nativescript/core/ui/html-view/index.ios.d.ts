import { HtmlViewBase } from './html-view-common';
export * from './html-view-common';
export declare class HtmlView extends HtmlViewBase {
    nativeViewProtected: UITextView;
    private currentHtml;
    createNativeView(): UITextView;
    initNativeView(): void;
    get ios(): UITextView;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    private renderWithStyles;
}
