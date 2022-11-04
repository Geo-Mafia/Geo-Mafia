import { CSSShadow } from '../styling/css-shadow';
import { TextBaseCommon } from './text-base-common';
import { FormattedString } from './formatted-string';
import { Span } from './span';
import { CoreTypes } from '../../core-types';
export * from './text-base-common';
export declare class TextBase extends TextBaseCommon {
    nativeViewProtected: UITextField | UITextView | UILabel | UIButton;
    nativeTextViewProtected: UITextField | UITextView | UILabel | UIButton;
    private _tappable;
    private _tapGestureRecognizer;
    _spanRanges: NSRange[];
    initNativeView(): void;
    _setTappableState(tappable: boolean): void;
    _setColor(color: UIColor): void;
    _setNativeText(reset?: boolean): void;
    createFormattedTextNative(value: FormattedString): NSMutableAttributedString;
    getFormattedStringDetails(formattedString: FormattedString): {
        spans: any[];
    };
    createMutableStringDetails(span: Span, text: string, index?: number): any;
    createMutableStringForSpan(span: Span, text: string): NSMutableAttributedString;
    getBaselineOffset(font: UIFont, align?: CoreTypes.VerticalAlignmentTextType): number;
    _setShadow(value: CSSShadow): void;
}
export declare function getTransformedText(text: string, textTransform: CoreTypes.TextTransformType): string;
