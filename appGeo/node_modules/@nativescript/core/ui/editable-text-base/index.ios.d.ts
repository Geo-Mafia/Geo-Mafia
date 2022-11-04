import { EditableTextBase as EditableTextBaseCommon } from './editable-text-base-common';
import { FormattedString } from '../text-base/formatted-string';
export * from './editable-text-base-common';
export declare abstract class EditableTextBase extends EditableTextBaseCommon {
    nativeViewProtected: UITextField | UITextView;
    readonly nativeTextViewProtected: UITextField | UITextView;
    dismissSoftInput(): void;
    setSelection(start: number, stop?: number): void;
}
export declare function _updateCharactersInRangeReplacementString(formattedText: FormattedString, rangeLocation: number, rangeLength: number, replacementString: string): void;
