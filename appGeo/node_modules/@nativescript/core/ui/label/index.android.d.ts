import { Label as LabelDefinition } from '.';
import { TextBase } from '../text-base';
export * from '../text-base';
export declare class Label extends TextBase implements LabelDefinition {
    nativeViewProtected: android.widget.TextView;
    nativeTextViewProtected: android.widget.TextView;
    get textWrap(): boolean;
    set textWrap(value: boolean);
    createNativeView(): globalAndroid.widget.TextView;
    initNativeView(): void;
}
