import { TextViewBase as TextViewBaseCommon } from './text-view-common';
export declare class TextView extends TextViewBaseCommon {
    nativeViewProtected: UITextView;
    nativeTextViewProtected: UITextView;
    private _delegate;
    _isShowingHint: boolean;
    _isEditing: boolean;
    private _hintColor;
    private _textColor;
    createNativeView(): UITextView;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    onUnloaded(): void;
    get ios(): UITextView;
    textViewShouldBeginEditing(textView: UITextView): boolean;
    textViewDidBeginEditing(textView: UITextView): void;
    textViewDidEndEditing(textView: UITextView): void;
    textViewDidChange(textView: UITextView): void;
    textViewShouldChangeTextInRangeReplacementText(textView: UITextView, range: NSRange, replacementString: string): boolean;
    scrollViewDidScroll(sv: UIScrollView): void;
    _refreshHintState(hint: string, text: string): void;
    private _refreshColor;
    showHint(hint: string): void;
    showText(): void;
}
